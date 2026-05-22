import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'jansankalp-frontend',
    brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
});

const producer = kafka.producer();

export const emitEvent = async (topic: string, data: any) => {
    try {
        await producer.connect();
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(data) },
            ],
        });
        console.log(`Event emitted to topic: ${topic}`);
    } catch (error) {
        console.error(`Error emitting event to ${topic}:`, error);
    } finally {
        // Optional: we might want to keep the producer connected in production
        // await producer.disconnect();
    }
};
