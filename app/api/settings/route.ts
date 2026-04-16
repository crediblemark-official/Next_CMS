
import { NextResponse } from "next/server";
import { getSiteSettings, updateSiteSettings } from "../../../lib/settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const settingsSchema = z.object({
    siteName: z.string().min(1, "Site name is required").optional(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
    footerCopyright: z.string().optional(),
    showCart: z.boolean().optional(),
    showFloatingChat: z.boolean().optional(),
    whatsappNumber: z.string().optional(),
    googleAnalyticsId: z.string().optional(),
});

export async function GET() {
    try {
        const settings = await getSiteSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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
        const validation = settingsSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: validation.error.format() 
            }, { status: 400 });
        }

        const updated = await updateSiteSettings(body);
        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
