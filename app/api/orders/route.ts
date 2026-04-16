
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, name, email, address, city, zip } = body;

        // Use session info if available, otherwise use form data
        const customerEmail = session?.user?.email || email;
        const customerName = session?.user?.name || name || "Guest Customer";
        const customerAddress = address ? `${address}${city ? `, ${city}` : ""}${zip ? ` ${zip}` : ""}` : "No Address Provided";

        if (!customerEmail) {
            return new NextResponse("Email is required", { status: 400 });
        }

        if (!items || items.length === 0) {
            return new NextResponse("No items in cart", { status: 400 });
        }

        // Calculate total safely
        const total = items.reduce((acc: number, item: any) => acc + (Number(item.price) * item.quantity), 0);

        const newOrder = await db.order.create({
            data: {
                customerName,
                customerEmail,
                customerAddress,
                total: total.toFixed(2),
                status: "pending",
                paymentStatus: "pending",
                fulfillmentStatus: "unfulfilled",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: Number(item.price).toFixed(2)
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error("[CreateOrder]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
