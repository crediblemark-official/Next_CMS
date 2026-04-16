
/**
 * Utility to serialize Prisma objects into plain objects that can be passed
 * from Server Components to Client Components.
 * Handles Decimal types (converts to string) and Date types (converts to string/ISO).
 */
export function serializeProduct(product: any) {
    if (!product) return null;

    return {
        ...product,
        // Convert Decimal to string
        price: product.price?.toString() || "0",
        // Convert Dates to ISO strings
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined,
        updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
    };
}

export function serializeProducts(products: any[]) {
    return products.map(serializeProduct);
}

export function serializeOrder(order: any) {
    if (!order) return null;

    return {
        ...order,
        total: order.total?.toString() || "0",
        createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : undefined,
        updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : undefined,
        // Also serialize items if they exist
        items: order.items ? order.items.map((item: any) => ({
            ...item,
            price: item.price?.toString() || "0"
        })) : undefined
    };
}

export function serializeOrders(orders: any[]) {
    return orders.map(serializeOrder);
}
