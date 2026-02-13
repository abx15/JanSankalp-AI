import prisma from "@/lib/prisma";

export async function seedDepartments() {
    const departments = [
        "Waste Management",
        "Roads & Infrastructure",
        "Water Supply",
        "Electricity & Lighting",
        "Public Health",
        "Drainage & Sewage"
    ];

    for (const name of departments) {
        await prisma.department.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
}
