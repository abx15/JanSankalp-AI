import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { notifyResolutionWithAI } from "@/lib/notification-service";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Only admins can run the auto-resolution processor
        if (!session || (session.user as any).role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Fetch pending complaints (limit to 10 for safety/speed)
        const pendingComplaints = await prisma.complaint.findMany({
            where: { status: "PENDING" },
            include: { author: { select: { name: true, email: true } } },
            take: 10,
        });

        const results = [];

        for (const complaint of pendingComplaints) {
            // 2. AI Analysis for Resolution
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI Resolution Agent for JanSankalp. 
            Analyze the complaint and decide if it can be 'AUTO_RESOLVED' (e.g., if it's already a solved issue or a duplicate) or if it needs 'MANUAL_OFFICER'.
            Return ONLY JSON:
            {
              "decision": "AUTO_RESOLVED" | "MANUAL_OFFICER",
              "reason": "Short reason for decision",
              "resolutionDetails": "Suggested resolution steps if auto-resolved"
            }`
                    },
                    { role: "user", content: `Title: ${complaint.title}\nDescription: ${complaint.description}` }
                ],
                response_format: { type: "json_object" }
            });

            const analysis = JSON.parse(response.choices[0].message.content || "{}");

            if (analysis.decision === "AUTO_RESOLVED") {
                // 3. Update Database
                await prisma.complaint.update({
                    where: { id: complaint.id },
                    data: {
                        status: "RESOLVED",
                        translatedText: analysis.resolutionDetails,
                        confidenceScore: 0.95 // High confidence for auto-resolve
                    }
                });

                // 4. Notify User
                if (complaint.author.email) {
                    await notifyResolutionWithAI({
                        userId: complaint.authorId,
                        userEmail: complaint.author.email,
                        userName: complaint.author.name || "Citizen",
                        complaintId: complaint.id,
                        ticketId: complaint.ticketId,
                        resolutionDetails: analysis.resolutionDetails,
                        complaintTitle: complaint.title
                    });
                }

                results.push({ id: complaint.id, status: "RESOLVED", reason: analysis.reason });
            } else {
                results.push({ id: complaint.id, status: "MANUAL_PENDING", reason: analysis.reason });
            }
        }

        return NextResponse.json({
            message: `Processed ${pendingComplaints.length} complaints.`,
            results
        });

    } catch (error) {
        console.error("AI_PROCESS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
