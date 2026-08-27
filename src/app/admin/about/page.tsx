"use client";

import { useEffect, useState } from "react";
import { Plus, X, Save } from "lucide-react";
import { ABOUT_COMPANY, type AboutCompany } from "@/data/adminContent";
import { Field, ImageField, inputCls } from "@/components/admin/Modal";
import { getSettings, saveSettings } from "@/lib/client/api";

export default function AboutManager() {
    const [form, setForm] = useState<AboutCompany>({ ...ABOUT_COMPANY });
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        getSettings<AboutCompany>("about-company")
            .then((section) => {
                setForm(section);
                setApiError(null);
            })
            .catch((error: unknown) => {
                setApiError(error instanceof Error ? error.message : "Unable to load About Us content.");
            });
    }, []);

    const save = async () => {
        setSaving(true);
        setApiError(null);
        try {
            const savedSection = await saveSettings<AboutCompany>("about-company", form);
            setForm(savedSection);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "Unable to save About Us content.");
        } finally {
            setSaving(false);
        }
    };

    const addDirector = () => {
        setForm((f) => ({
            ...f,
            directors: [...f.directors, { name: "New Director", photo: "", description: "" }]
        }));
    };

    const removeDirector = (index: number) => {
        setForm((f) => ({
            ...f,
            directors: f.directors.filter((_, i) => i !== index)
        }));
    };

    const updateDirector = (index: number, field: keyof AboutCompany['directors'][0], value: string) => {
        setForm((f) => {
            const newDirectors = [...f.directors];
            newDirectors[index] = { ...newDirectors[index], [field]: value };
            return { ...f, directors: newDirectors };
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">About Us / Board of Directors</h1>
                    <p className="text-sm text-slate-500">Manage the company Vision, Mission, and leadership team.</p>
                </div>
                <button disabled={saving} onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-emerald-650 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-650/20 hover:bg-emerald-750 disabled:cursor-not-allowed disabled:opacity-60">
                    <Save className="h-4 w-4" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </button>
            </div>

            {apiError && (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
                    {apiError}
                </p>
            )}

            <div className="space-y-6">
                {/* Statements Form */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Core Statements</h3>
                    <div className="space-y-4">
                        <Field label="Vision Statement" full>
                            <textarea rows={4} className={inputCls} value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} placeholder="Enter company vision..." />
                        </Field>
                        <Field label="Mission Statement" full>
                            <textarea rows={4} className={inputCls} value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} placeholder="Enter company mission..." />
                        </Field>
                    </div>
                </div>

                {/* Directors Form */}
                <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Board of Directors</h3>
                        <button onClick={addDirector} className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-stone-200">
                            <Plus className="h-4 w-4" /> Add Director
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {form.directors.map((dir, idx) => (
                            <div key={idx} className="relative rounded-xl border border-stone-100 bg-stone-50/50 p-5 pt-8">
                                <button onClick={() => removeDirector(idx)} className="absolute right-3 top-3 rounded-lg p-1.5 text-rose-400 hover:bg-rose-100 hover:text-rose-600">
                                    <X className="h-4 w-4" />
                                </button>
                                
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <Field label="Director Name">
                                        <input className={inputCls} value={dir.name} onChange={(e) => updateDirector(idx, 'name', e.target.value)} placeholder="E.g. Mr. Sonu Agrawal" />
                                    </Field>
                                    <ImageField label="Director Photo" value={dir.photo} onChange={(v) => updateDirector(idx, 'photo', v)} />
                                    <Field label="Description / Profile" full>
                                        <textarea rows={6} className={inputCls} value={dir.description} onChange={(e) => updateDirector(idx, 'description', e.target.value)} placeholder="Experience, vision, background..." />
                                    </Field>
                                </div>
                            </div>
                        ))}
                        {form.directors.length === 0 && (
                            <p className="text-center text-sm text-slate-500 py-4">No directors added yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
