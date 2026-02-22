import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isAdmin(session: any) {
    return session?.user?.role === "ADMIN";
}

// PUT — update a department name and/or head
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!isAdmin(session)) return new NextResponse("Unauthorized", { status: 401 });

    const { name, headId } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    try {
        // Check name uniqueness (excluding self)
        const conflict = await prisma.department.findFirst({
            where: { name: name.trim(), NOT: { id: params.id } },
        });
        if (conflict) return NextResponse.json({ error: "A department with this name already exists" }, { status: 400 });

        const dept = await prisma.department.update({
            where: { id: params.id },
            data: { name: name.trim(), headId: headId || null },
            include: { head: { select: { id: true, name: true, email: true } }, _count: { select: { complaints: true } } },
        });
        return NextResponse.json(dept);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE — delete a department (only if it has no active complaints)
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!isAdmin(session)) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const dept = await prisma.department.findUnique({
            where: { id: params.id },
            include: { _count: { select: { complaints: true } } },
        });
        if (!dept) return NextResponse.json({ error: "Department not found" }, { status: 404 });

        if (dept._count.complaints > 0) {
            return NextResponse.json(
                { error: `Cannot delete: ${dept._count.complaints} complaints are linked to this department. Reassign them first.` },
                { status: 400 }
            );
        }

        await prisma.department.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true, message: "Department deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
