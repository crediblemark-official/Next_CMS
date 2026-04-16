
import { NextResponse } from "next/server";
import { getMenu, updateMenu } from "../../../lib/menus";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const menuItemSchema = z.object({
    label: z.string().min(1, "Label is required"),
    url: z.string().min(1, "URL is required"),
    order: z.number().int().default(0),
    target: z.string().optional().default("_self"),
});

const menuUpdateSchema = z.object({
    slug: z.string().min(1, "Slug is required"),
    items: z.array(menuItemSchema),
});

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || "main";

    try {
        const menu = await getMenu(slug);
        return NextResponse.json(menu);
    } catch (error) {
        console.error("Error fetching menu:", error);
        return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        
        // Validate with Zod
        const validation = menuUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { slug, items } = validation.data;

        const updated = await updateMenu(slug, items);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating menu:", error);
        return NextResponse.json({ error: "Failed to update menu" }, { status: 500 });
    }
}
