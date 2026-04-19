"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Copy, Upload, Image as ImageIcon, Loader2, Plus, ExternalLink, MessageSquare } from "lucide-react";
import { 
    PageHeader, 
    CardSkeleton,
    EmptyState
} from "@/components/dashboard/ui/DataTable";

type MediaItem = {
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    createdAt: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function MediaPage() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = () => {
        fetch("/api/media")
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        if (file.size > MAX_FILE_SIZE) {
            alert("File too large. Max size is 5MB.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error || "Upload failed");
            }

            fetchMedia();
        } catch (error: any) {
            alert(error.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this image?")) return;
        setDeletingId(id);

        try {
            await fetch(`/api/media?id=${id}`, { method: "DELETE" });
            fetchMedia();
        } catch (error) {
            alert("Failed to delete image");
        } finally {
            setDeletingId(null);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("URL Copied!");
    };

    return (
        <div className="w-full animate-in fade-in duration-700 pb-20 px-4">
            <PageHeader 
                title="Media Library" 
                subtitle="Manage and curate your digital assets."
            >
                <div className="w-full md:w-auto">
                    <label className={`
                        inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-[#2eaadc] text-white rounded cursor-pointer hover:bg-[#1a99cc] transition-colors font-bold text-xs
                        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}>
                        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploading ? "Uploading..." : "Upload Media"}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </PageHeader>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <EmptyState 
                    icon={<ImageIcon size={32} />} 
                    message="Your media library is currently empty. Start uploading your brand assets." 
                />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className="group relative bg-[#202020] rounded border border-[#2f2f2f] overflow-hidden transition-all">
                            <div className="aspect-square bg-white/[0.02] relative overflow-hidden">
                                <Image
                                    src={item.url}
                                    alt={item.filename}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(item.url)}
                                        className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                                        title="Copy URL"
                                    >
                                        <Copy size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="w-8 h-8 flex items-center justify-center bg-red-500/80 hover:bg-red-500 text-white rounded transition-colors"
                                        title="Delete"
                                        disabled={deletingId === item.id}
                                    >
                                        {deletingId === item.id ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-[11px] font-medium text-white truncate" title={item.filename}>
                                    {item.filename}
                                </p>
                                <p className="text-[9px] text-white font-medium">
                                    {(item.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
