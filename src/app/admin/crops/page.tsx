"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { CropItem, FertilizerSchedule } from "@/data/adminContent";
import Modal, { Field, ImageField, SaveFooter, inputCls } from "@/components/admin/Modal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { useResource } from "@/lib/client/useResource";
import type { Product } from "@/data/products";

export default function CropsManager() {
    const { items, error, save: saveItem, remove: removeItem } = useResource<CropItem>("crops");
    const { items: products } = useResource<Product>("products");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<CropItem | null>(null);
    const [form, setForm] = useState<CropItem>({ id: "", name: "", desc: "", image: "", fertilizerSchedules: [] });

    const openNew = () => {
        setEditing(null);
        setForm({ id: `crop-${Date.now()}`, name: "", desc: "", image: "", fertilizerSchedules: [] });
        setOpen(true);
    };
    const openEdit = (c: CropItem) => {
        setEditing(c);
        setForm({ ...c });
        setOpen(true);
    };
    const save = async () => {
        try {
            await saveItem(form, editing?.id);
            setOpen(false);
        } catch (saveError) {
            alert(saveError instanceof Error ? saveError.message : "Unable to save crop schedule.");
        }
    };
    const remove = async (id: string) => {
        if (!confirm("Delete this crop schedule?")) return;
        try {
            await removeItem(id);
        } catch (removeError) {
            alert(removeError instanceof Error ? removeError.message : "Unable to delete crop schedule.");
        }
    };

    const addSchedule = () => {
        const newSched = [...(form.fertilizerSchedules || []), { id: `sched-${Date.now()}`, productId: "", productName: "", startDay: 1, endDay: 10, quantity: "", unit: "kg/acre", remark: "" }];
        setForm({ ...form, fertilizerSchedules: newSched });
    };

    const updateSchedule = (index: number, field: keyof FertilizerSchedule, value: string | number) => {
        const newSched = [...(form.fertilizerSchedules || [])];
        if (field === 'productId') {
            const product = products.find(p => p.id === value);
            newSched[index].productName = product ? product.name : "";
        }
        newSched[index] = { ...newSched[index], [field]: value } as FertilizerSchedule;
        setForm({ ...form, fertilizerSchedules: newSched });
    };

    const removeSchedule = (index: number) => {
        const newSched = (form.fertilizerSchedules || []).filter((_, i) => i !== index);
        setForm({ ...form, fertilizerSchedules: newSched });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Crop Schedules</h1>
                    <p className="text-sm text-slate-500">Manage the {`"Customized Schedules By Crops"`} section.</p>
                </div>
                <button onClick={openNew} className="inline-flex items-center gap-2 rounded-xl bg-emerald-650 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-650/20 hover:bg-emerald-750">
                    <Plus className="h-4 w-4" /> Add Crop
                </button>
            </div>

            {error && <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">{error}</p>}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                    <div key={c.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                        <div className="relative h-28 w-full bg-stone-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-1 p-4">
                            <h3 className="font-display text-base font-extrabold tracking-tight text-slate-900">{c.name}</h3>
                            <p className="text-xs text-slate-500">{c.desc}</p>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-50">
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </button>
                                <button onClick={() => remove(c.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                open={open}
                title={editing ? "Edit Crop Schedule" : "Add Crop Schedule"}
                subtitle="Crop name, emoji icon, pest/disease description and image"
                onClose={() => setOpen(false)}
                footer={<SaveFooter onClose={() => setOpen(false)} isEdit={!!editing} onSave={save} />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Crop Name">
                        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tomato" />
                    </Field>
                    <ImageField label="Crop Image" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
                    <Field label="Pest / Disease Description" full>
                        <input className={inputCls} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Early Blight, Powdery Mildew, Fruit Borer" />
                    </Field>
                    <Field label="Fertigation Schedule" full>
                        <div className="space-y-4">
                            {(form.fertilizerSchedules || []).map((sched, idx) => (
                                <div key={sched.id} className="relative rounded-xl border border-stone-200 bg-stone-50 p-4 pt-8 shadow-sm">
                                    <button 
                                      onClick={() => removeSchedule(idx)} 
                                      className="absolute right-3 top-3 text-rose-500 hover:text-rose-700"
                                      title="Remove"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                        <div>
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Product</label>
                                            <select 
                                                className={inputCls} 
                                                value={sched.productId} 
                                                onChange={(e) => updateSchedule(idx, 'productId', e.target.value)}
                                            >
                                                <option value="">-- Select Product --</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Start Day</label>
                                                <input type="number" className={inputCls} value={sched.startDay} onChange={(e) => updateSchedule(idx, 'startDay', Number(e.target.value))} />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">End Day</label>
                                                <input type="number" className={inputCls} value={sched.endDay} onChange={(e) => updateSchedule(idx, 'endDay', Number(e.target.value))} />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Qty</label>
                                                <input type="text" className={inputCls} value={sched.quantity} onChange={(e) => updateSchedule(idx, 'quantity', e.target.value)} placeholder="e.g. 5" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Unit</label>
                                                <input type="text" className={inputCls} value={sched.unit} onChange={(e) => updateSchedule(idx, 'unit', e.target.value)} placeholder="kg/acre" />
                                            </div>
                                        </div>
                                        <div className="col-span-1 sm:col-span-2 mt-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Remark (Optional)</label>
                                            <input type="text" className={inputCls} value={sched.remark || ""} onChange={(e) => updateSchedule(idx, 'remark', e.target.value)} placeholder="Any special instructions or remarks..." />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addSchedule} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 py-3 text-sm font-semibold text-stone-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                                <Plus className="h-4 w-4" /> Add Fertilizer Entry
                            </button>
                        </div>
                    </Field>
                    <Field label="Additional Information" full>
                        <RichTextEditor value={form.schedule || ""} onChange={(val) => setForm({ ...form, schedule: val })} />
                    </Field>
                </div>
            </Modal>
        </div>
    );
}
