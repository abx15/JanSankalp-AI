import { Kafka } from 'kafkajs';
import { pusherServer } from './pusher';
import prisma from './prisma';

const kafka = new Kafka({
    clientId: 'jansankalp-bridge',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'bridge-group' });

export const startBridge = async () => {
    await consumer.connect();
    await consumer.subscribe({ topics: ['complaint_processed', 'complaint_rejected'], fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message.value) return;
            const data = JSON.parse(message.value.toString());
            console.log(`[BRIDGE] Received event on ${topic}:`, data);

            if (topic === 'complaint_processed') {
                // 1. Update DB with AI Analysis
                await prisma.complaint.update({
                    where: { id: data.complaint_id },
                    data: {
                        status: data.status,
                        category: data.analysis.category,
                        severity: data.analysis.severity === "Critical" ? 5 :
                            data.analysis.severity === "High" ? 4 :
                                data.analysis.severity === "Medium" ? 3 : 2,
                        confidenceScore: data.analysis.confidence,
                        aiAnalysis: data.analysis,
                        assignedToId: data.assigned_officer,
                        isDuplicate: data.is_duplicate,
                    } as any
                });

                // 2. Push to WebSocket (including regional scope)
                await pusherServer.trigger('governance-channel', 'complaint-status-updated', {
                    id: data.complaint_id,
                    ticketId: data.ticketId,
                    status: data.status,
                    category: data.analysis.category,
                    assignedToId: data.assigned_officer,
                    districtId: data.districtId
                });
            }

            if (topic === 'complaint_rejected') {
                await prisma.complaint.update({
                    where: { id: data.complaint_id },
                    data: { status: 'REJECTED', spamScore: data.score } as any
                });

                await pusherServer.trigger('governance-channel', 'complaint-rejected', {
                    id: data.complaint_id,
                    reason: data.reason
                });
            }
        },
    });
};
