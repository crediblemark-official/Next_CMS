
import { db } from "../../../../lib/db";
import ProductEditor from "../ProductEditor";
import ProductDetails from "../ProductDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { serializeProduct } from "../../../../lib/serialize";

export default async function ProductPage({
    params
}: {
    params: Promise<{ productId: string }>;
}) {
    const { productId } = await params;
    const session = await getServerSession(authOptions);
    const isAdminOrEditor = session?.user?.role === "admin" || session?.user?.role === "editor";

    let initialData = null;

    if (productId !== "new") {
        const product = await db.product.findUnique({
            where: { id: productId }
        });

        if (product) {
            initialData = serializeProduct(product);
        }
    }

    if (!isAdminOrEditor && productId !== "new" && initialData) {
        return <ProductDetails product={initialData} />;
    }

    // Admins or creating new product
    return <ProductEditor productId={productId === "new" ? undefined : productId} initialData={initialData} />;
}
