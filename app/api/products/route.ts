
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
    description: z.string().optional(),
    price: z.coerce.number().positive("Price must be a positive number"),
    stock: z.coerce.number().int().nonnegative("Stock cannot be negative").optional().default(0),
    images: z.array(z.string()).optional().default([]),
    productId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const isAdminOrEditor = session?.user?.role === "admin" || session?.user?.role === "editor";

        const { searchParams } = new URL(req.url);
        const includeArchived = searchParams.get("includeArchived") === "true";

        const whereCondition = (isAdminOrEditor && includeArchived) ? {} : { isArchived: false };

        const allProducts = await db.product.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ products: allProducts });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id, isArchived } = body;

        if (!id) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const product = await db.product.update({
            where: { id },
            data: { isArchived }
        });

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error archiving product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
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
        const validation = productSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { name, slug, description, price, stock, images, productId } = validation.data;

        let product;

        if (productId) {
            // Update
            product = await db.product.update({
                where: { id: productId },
                data: {
                    name,
                    slug,
                    description,
                    price,
                    stock,
                    images,
                    updatedAt: new Date()
                }
            });
        } else {
            // Create
            product = await db.product.create({
                data: {
                    name,
                    slug,
                    description,
                    price,
                    stock,
                    images,
                    updatedAt: new Date()
                }
            });
        }

        return NextResponse.json({ success: true, product });

    } catch (error) {
        console.error("Error saving product:", error);
        return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("id");

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        await db.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product FULL DETAILS:", error);
        // @ts-ignore
        if (error.code === 'P2003') {
            return NextResponse.json({ error: "Cannot delete product because it is part of an existing order." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to delete product: " + (error as Error).message }, { status: 500 });
    }
}
