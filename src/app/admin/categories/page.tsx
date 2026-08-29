"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { CategoryItem } from "@/data/adminContent";
import Modal, { Field, ImageField, SaveFooter, inputCls } from "@/components/admin/Modal";
import { useResource } from "@/lib/client/useResource";

export default function CategoriesManager() {
    const { items, error, save: saveItem, remove: removeItem } = useResource<CategoryItem>("categories");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CategoryItem | null>(null);
    const [form, setForm] = useState<CategoryItem>({ id: "", name: "", count: 0, desc: "", image: "", order: 99, isComingSoon: false });

    const openNew = () => {
        setEditing(null);
        setForm({ id: `cat-${Date.now()}`, name: "", count: 0, desc: "", image: "", order: 99, isComingSoon: false });
        setOpen(true);
    };
    const openEdit = (c: CategoryItem) => {
        setEditing(c);
        setForm({ ...c });
        setOpen(true);
    };
    const save = async () => {
        try {
            await saveItem(form, editing?.id);
            setOpen(false);
        } catch (saveError) {
            alert(saveError instanceof Error ? saveError.message : "Unable to save category.");
        }
    };
    const remove = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            await removeItem(id);
        } catch (removeError) {
            alert(removeError instanceof Error ? removeError.message : "Unable to delete category.");
        }
    };

    const clearAll = async () => {
        if (!confirm("Are you sure you want to delete ALL categories from the database?")) return;
        try {
            for (const item of items) {
                await removeItem(item.id);
            }
        } catch (clearError) {
            alert(clearError instanceof Error ? clearError.message : "Unable to clear all categories.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Categories</h1>
                    <p className="text-sm text-slate-500">Manage the {`"Shop by Categories"`} tiles on the homepage.</p>
                </div>
                <div className="flex items-center gap-2">
                    {items.length > 0 && (
                        <button onClick={clearAll} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100">
                            Clear All ({items.length})
                        </button>
                    )}
                    <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-emerald-650 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-650/20 hover:bg-emerald-750">
                        <Plus className="h-4 w-4" /> Add Category
                    </button>
                </div>
            </div>

            {error && <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">{error}</p>}
            <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-stone-100 bg-stone-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-bold">Image</th>
                            <th className="px-4 py-3 font-bold">Name</th>
                            <th className="px-4 py-3 font-bold">Products</th>
                            <th className="px-4 py-3 font-bold">Description</th>
                            <th className="px-4 py-3 font-bold">Order</th>
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 text-right font-bold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {items.map((c) => (
                            <tr key={c.id} className="hover:bg-stone-50/60">
                                <td className="px-4 py-3">
                                    <div className="h-12 w-12 overflow-hidden rounded-xl bg-stone-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-bold text-slate-900">{c.name}</td>
                                <td className="px-4 py-3 text-slate-600">{c.count}</td>
                                <td className="px-4 py-3 text-slate-500">{c.desc}</td>
                                <td className="px-4 py-3 text-slate-900 font-bold">{c.order ?? 999}</td>
                                <td className="px-4 py-3">
                                    {c.isComingSoon ? (
                                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-700">Coming Soon</span>
                                    ) : (
                                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Active</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEdit(c)} className="rounded-lg border border-stone-200 p-2 text-slate-600 hover:bg-stone-50">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => remove(c.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 hover:bg-rose-50">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                open={open}
                title={editing ? "Edit Category" : "Add Category"}
                subtitle="Shown in the Shop by Categories grid"
                onClose={() => setOpen(false)}
                footer={<SaveFooter onClose={() => setOpen(false)} isEdit={!!editing} onSave={save} />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Category Name">
                        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Fertilizers" />
                    </Field>
                    <Field label="Product Count">
                        <input type="number" className={inputCls} value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} placeholder="18" />
                    </Field>
                    <Field label="Description" full>
                        <input className={inputCls} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Organic, NPK Solubles, Micronutrients & Biofertilizers" />
                    </Field>
                    <Field label="Sort Order">
                        <input type="number" className={inputCls} value={form.order || 0} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} placeholder="e.g. 1" />
                    </Field>
                    <Field label="Status">
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" checked={form.isComingSoon || false} onChange={(e) => setForm({ ...form, isComingSoon: e.target.checked })} />
                            <span className="text-sm font-semibold text-slate-700">Mark as Coming Soon</span>
                        </label>
                    </Field>
                    <ImageField label="Category Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
                </div>
            </Modal>
        </div>
    );
}
