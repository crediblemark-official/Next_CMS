import { db } from "./db";
import { Prisma } from "@prisma/client";

export type SiteSettings = Prisma.SiteSettingsGetPayload<{}>;
export type SiteSettingsUpdate = Partial<Omit<SiteSettings, "id" | "updatedAt">>;
export type PaymentSettings = Prisma.PaymentSettingsGetPayload<{}>;

// Force TS update v4

export const getSiteSettings = async (): Promise<SiteSettings> => {
    const settings = await db.siteSettings.findFirst();
    if (settings) return settings;

    // Create default settings if none exist
    const newSettings = await db.siteSettings.create({
        data: {
            siteName: "My Awesome Site",
            description: "Welcome to my website",
            footerCopyright: `© ${new Date().getFullYear()} All Rights Reserved.`,
        }
    });

    return newSettings;
};

export const updateSiteSettings = async (data: SiteSettingsUpdate) => {
    const current = await getSiteSettings();

    const updated = await db.siteSettings.update({
        where: { id: current.id },
        data: {
            ...data,
            updatedAt: new Date(),
        }
    });

    return updated;
};

export const getPaymentSettings = async (): Promise<PaymentSettings> => {
    const settings = await db.paymentSettings.findFirst();
    if (settings) return settings;

    // Create default settings if none exist
    const newSettings = await db.paymentSettings.create({
        data: {
            bankName: "Example Bank",
            accountNumber: "0000000000",
            accountHolder: "Store Owner",
            currency: "USD",
            instructions: "Please include your order number in the transfer note."
        }
    });

    return newSettings;
};
