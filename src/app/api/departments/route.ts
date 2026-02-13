import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const departments = await prisma.department.findMany({
            include: {
                _count: {
                    select: { complaints: true }
                }
            }
        });

        return NextResponse.json(departments);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
