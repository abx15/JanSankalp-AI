import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isAdmin(session: any) {
    return session?.user?.role === "ADMIN";
}

// GET — list all departments with officer count and complaint count
export async function GET() {
    try {
        const departments = await prisma.department.findMany({
            include: {
                head: { select: { id: true, name: true, email: true } },
                _count: { select: { complaints: true } },
            },
            orderBy: { name: "asc" },
        });
        return NextResponse.json(departments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST — create a new department
export async function POST(req: Request) {
    const session = await auth();
    if (!isAdmin(session)) return new NextResponse("Unauthorized", { status: 401 });

    const { name, headId } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Department name is required" }, { status: 400 });

    try {
        const existing = await prisma.department.findUnique({ where: { name: name.trim() } });
        if (existing) return NextResponse.json({ error: "Department already exists" }, { status: 400 });

        const dept = await prisma.department.create({
            data: { name: name.trim(), headId: headId || null },
            include: { head: { select: { id: true, name: true, email: true } }, _count: { select: { complaints: true } } },
        });
        return NextResponse.json(dept, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
