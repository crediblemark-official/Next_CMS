"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import TiptapEditor from "@/components/TiptapEditor";

function PageEditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEditing = searchParams.has("path");
    const initialPath = searchParams.get("path") || "";

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        path: "",
        title: "",
        description: "",
        imageUrl: "",
        body: "",
        isPublished: true,
        useBuilder: false,
        data: null
    });

    useEffect(() => {
        if (isEditing && initialPath) {
            fetch(`/api/pages`)
                .then(res => res.json())
                .then(data => {
                    const page = data.find((p: any) => p.path === initialPath);
                    if (page) {
                        setFormData({
                            id: page.id,
                            path: page.path,
                            title: page.title || "",
                            description: page.description || "",
                            imageUrl: page.imageUrl || "",
                            body: page.body || "",
                            isPublished: page.isPublished,
                            useBuilder: page.useBuilder,
                            data: page.data
                        });
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isEditing, initialPath]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData(prev => {
            const newData = { ...prev, [e.target.name]: value };
            if (!isEditing && e.target.name === 'title' && !prev.path) {
                const slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                newData.path = `/${slug}`;
            }
            return newData;
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save");
            }
            router.push("/dashboard/pages");
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="w-full animate-in fade-in duration-700 pb-20 px-4 space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b border-[#2f2f2f] py-3">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/pages" className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center text-white hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">
                            {isEditing ? "Edit Page" : "Create Page"}
                        </h1>
                        <p className="text-[10px] font-bold text-white uppercase tracking-widest">
                            {isEditing ? formData.path : "Drafting Standard Page"}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-1.5 bg-[#2eaadc] text-white rounded text-xs font-bold hover:bg-[#1a99cc] transition-colors disabled:opacity-50"
                >
                    {saving ? <Loader2 size={14} className="animate-spin mr-2" /> : <Save size={14} className="mr-2" />}
                    Save Page
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white uppercase tracking-widest opacity-50 ml-1">Title</label>
                            <input
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-0 py-1 bg-transparent border-b border-[#2f2f2f] focus:border-white transition-colors outline-none text-xl font-bold text-white placeholder:text-[#373737]"
                                placeholder="Page Title"
                            />
                        </div>

                        <div className="bg-[#191919] rounded border border-[#2f2f2f] overflow-hidden min-h-[400px]">
                            <div className="px-4 py-2 bg-white/5 border-b border-[#2f2f2f]">
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Content Editor</span>
                            </div>
                            <TiptapEditor
                                content={formData.body}
                                onChange={(content) => {
                                    setFormData(prev => ({ ...prev, body: content }));
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar - Settings */}
                <div className="space-y-6">
                    <div className="bg-[#202020] rounded border border-[#2f2f2f] p-4 space-y-6">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest opacity-50">Settings</h4>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-1">URL Path</label>
                                <input
                                    name="path"
                                    required
                                    value={formData.path}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 bg-[#191919] border border-[#2f2f2f] rounded text-xs text-white font-mono outline-none focus:border-gray-500 transition-colors"
                                    placeholder="/path"
                                    disabled={isEditing && formData.path === "/"}
                                />
                                {isEditing && formData.path === "/" && (
                                    <p className="text-[9px] text-gray-600 mt-1 uppercase font-bold tracking-tighter italic font-sans">Root path is immutable</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-1">SEO Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-1.5 bg-[#191919] border border-[#2f2f2f] rounded text-xs text-white outline-none focus:border-gray-500 transition-colors resize-none"
                                    placeholder="Brief summary..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white uppercase tracking-widest ml-1">Social Image</label>
                                <input
                                    name="imageUrl"
                                    value={formData.imageUrl || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-1.5 bg-[#191919] border border-[#2f2f2f] rounded text-xs text-white outline-none focus:border-gray-500 transition-colors"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-[#2f2f2f] space-y-4">
                            <label className="flex items-center justify-between group cursor-pointer">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-white group-hover:text-[#2eaadc] transition-colors">Visible</span>
                                    <p className="text-[9px] text-white font-medium uppercase tracking-widest">Publically accessible</p>
                                </div>
                                <div 
                                    onClick={() => setFormData({...formData, isPublished: !formData.isPublished})}
                                    className={`w-8 h-4 rounded-full relative transition-colors ${formData.isPublished ? 'bg-[#2eaadc]' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${formData.isPublished ? 'left-[1.125rem]' : 'left-0.5'}`} />
                                </div>
                            </label>

                            {isEditing && (
                                <div className="pt-4 border-t border-[#2f2f2f] space-y-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest opacity-50">Interface Mode</span>
                                        <p className={`text-[9px] font-bold uppercase tracking-widest ${formData.useBuilder ? 'text-emerald-500' : 'text-[#2eaadc] animate-pulse'}`}>
                                            ● Currently {formData.useBuilder ? 'Visual' : 'Standard'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            const isPromoting = !formData.useBuilder;
                                            const msg = isPromoting 
                                                ? "⚠️ SWITCH TO VISUAL BUILDER?\n\nSetting the CredBuild Visual Builder as primary will override the standard text view on your live site. Proceed?"
                                                : "⚠️ SWITCH TO STANDARD EDITOR?\n\nThis will disable the Visual Builder and use this text editor as the primary source for the live page. Proceed?";
                                            
                                            if (window.confirm(msg)) {
                                                setSaving(true);
                                                try {
                                                    const res = await fetch("/api/pages", {
                                                        method: "POST",
                                                        headers: { "Content-Type": "application/json" },
                                                        body: JSON.stringify({ ...formData, useBuilder: isPromoting }),
                                                    });
                                                    if (res.ok) {
                                                        if (isPromoting) {
                                                            const credbuildPath = formData.path === "/" ? "/credbuild" : `/credbuild${formData.path}`;
                                                            router.push(credbuildPath);
                                                        } else {
                                                            // Stay here but update local state
                                                            setFormData(prev => ({ ...prev, useBuilder: false }));
                                                            alert("Page successfully set to Standard Mode.");
                                                        }
                                                    }
                                                } catch (e) {
                                                    alert("Failed to switch mode");
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }
                                        }}
                                        className={`w-full py-2 bg-white/5 border border-[#2f2f2f] rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                            formData.useBuilder 
                                            ? 'hover:bg-red-500/10 hover:border-red-500/30 text-white' 
                                            : 'hover:bg-[#2eaadc]/10 hover:border-[#2eaadc]/30 text-white'
                                        }`}
                                    >
                                        {formData.useBuilder ? 'Switch to Standard Editor' : 'Enable Visual Builder'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default function PageEditor() {
    return (
        <Suspense fallback={<div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>}>
            <PageEditorContent />
        </Suspense>
    );
}
