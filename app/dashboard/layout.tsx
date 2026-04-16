import React from "react";
import DashboardShell from "../../components/dashboard/DashboardShell";
import { getSiteSettings } from "../../lib/settings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const settings = await getSiteSettings();

    return (
        <DashboardShell initialSettings={settings}>
            {children}
        </DashboardShell>
    );
}
