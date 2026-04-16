
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { z } from "zod";

const postSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
    content: z.any().optional().default({}),
    status: z.string().optional().default("draft"),
    imageUrl: z.string().optional(),
    postId: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const allPosts = await db.post.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ posts: allPosts });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
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
        const validation = postSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const { title, slug, content, status, imageUrl, postId } = validation.data;

        let post;

        // If postId provided, Update. Else Create.
        if (postId) {
            post = await db.post.update({
                where: { id: postId },
                data: {
                    title,
                    slug,
                    content: content || {},
                    imageUrl,
                    published: status === "published",
                    updatedAt: new Date()
                }
            });
        } else {
            // Create new
            post = await db.post.create({
                data: {
                    title,
                    slug,
                    content: content || {},
                    imageUrl,
                    published: status === "published",
                    authorId: session.user.id,
                    updatedAt: new Date()
                }
            });
        }

        return NextResponse.json({ success: true, post });

    } catch (error) {
        console.error("Error saving post:", error);
        return NextResponse.json({ error: `Failed to save post: ${(error as Error).message}` }, { status: 500 });
    }
}
