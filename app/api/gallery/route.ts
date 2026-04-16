
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const galleryItemSchema = z.object({
    title: z.string().optional(),
    url: z.string().url("Invalid image URL"),
    description: z.string().optional(),
});

export async function GET() {
    try {
        const items = await db.galleryItem.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(items);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        
        // Validate with Zod
        const validation = galleryItemSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const newItem = await db.galleryItem.create({
            data: validation.data
        });

        return NextResponse.json(newItem);
    } catch (error) {
        console.error("Gallery create error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("ID required", { status: 400 });

        await db.galleryItem.delete({
            where: { id: id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
