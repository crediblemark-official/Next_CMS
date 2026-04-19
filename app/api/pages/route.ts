
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

export async function GET() {
    try {
        const pages = await db.credBuildPage.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return NextResponse.json(pages);
    } catch (error) {
        console.error("Error fetching pages:", error);
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const { path } = body;

        if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

        await db.credBuildPage.delete({
            where: { path: path }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, path, title, description, imageUrl, body: contentBody, isPublished, useBuilder } = body;

        if (!path) return NextResponse.json({ error: "Missing path" }, { status: 400 });

        // Upsert logic
        if (id) {
            // Get existing to check for promotion
            const existing = await db.credBuildPage.findUnique({ where: { id } });
            
            let finalData = body.data;
            
            // Auto-migrate content if promoting from Standard to Visual and data is empty
            if (existing && !existing.useBuilder && useBuilder && (!finalData || Object.keys(finalData).length === 0)) {
                finalData = {
                    content: [
                        {
                            type: "RichText",
                            props: {
                                id: "migrated-content",
                                content: contentBody || ""
                            }
                        }
                    ],
                    root: { props: { title } }
                };
            }

            // Update existing by ID
            await db.credBuildPage.update({
                where: { id: id },
                data: {
                    path,
                    title,
                    description,
                    imageUrl,
                    body: contentBody,
                    isPublished,
                    useBuilder,
                    data: finalData ?? existing?.data ?? {},
                    updatedAt: new Date()
                }
            });
        } else {
            // Check if path exists (conflict check for new pages)
            const existing = await db.credBuildPage.findUnique({
                where: { path: path }
            });
            if (existing) {
                return NextResponse.json({ error: "Path already exists" }, { status: 409 });
            }

            await db.credBuildPage.create({
                data: {
                    path,
                    title,
                    description,
                    imageUrl,
                    body: contentBody,
                    isPublished: isPublished ?? true,
                    useBuilder: useBuilder ?? true,
                    data: {},
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
