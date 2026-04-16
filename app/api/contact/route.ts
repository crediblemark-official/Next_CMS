
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const contactFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    subject: z.string().optional().default("No Subject"),
    message: z.string().min(1, "Message is required"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validate with Zod
        const validation = contactFormSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const data = validation.data;

        await db.contactSubmission.create({
            data: data
        });

        // TODO: Send email notification to site owner

        return NextResponse.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact Form Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const submissions = await db.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(submissions);
    } catch (error) {
        console.error("Fetch Submissions Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
