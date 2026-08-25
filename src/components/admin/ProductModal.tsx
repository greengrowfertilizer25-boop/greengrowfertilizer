"use client";

import { useState } from "react";
import { X, Upload, Save, Trash2 } from "lucide-react";

import { uploadMedia } from "@/lib/client/api";

export interface ProductFormData {
    id?: string;
    name: string;
    category: string;
    subcategory: string;
    description: string;
    composition: string;
    originalPrice: number;
    currentPrice: number;
    discount: number;
    stock: number;
    image: string;
    isSoldOut: boolean;
    benefits: string;
    recommendedUsage: string;
    packagingDetails: string;
}

const emptyForm: ProductFormData = {
    name: "",
    category: "Fertilizers",
    subcategory: "",
    description: "",
    composition: "",
    originalPrice: 0,
    currentPrice: 0,
    discount: 0,
    stock: 0,
    image: "",
    isSoldOut: false,
    benefits: "",
    recommendedUsage: "",
    packagingDetails: "",
};

const categories = [
    "Fertilizers",
    "Pesticides",
    "Fungicides",
    "Herbicides",
    "Combos",
    "Plant Growth Regulators",
];

interface ProductModalProps {
    open: boolean;
    initialData?: ProductFormData | null;
    onClose: () => void;
    onSave: (data: ProductFormData) => void;
}

export default function ProductModal({
    open,
    initialData,
    onClose,
    onSave,
}: ProductModalProps) {
    if (!open) return null;

    return (
        <ProductModalContent
            initialData={initialData}
            onClose={onClose}
            onSave={onSave}
        />
    );
}

function ProductModalContent({
    initialData,
    onClose,
    onSave,
}: Omit<ProductModalProps, "open">) {
    const [form, setForm] = useState<ProductFormData>(() => initialData ?? emptyForm);
    const [uploading, setUploading] = useState(false);

    const update = <K extends keyof ProductFormData>(
        key: K,
        value: ProductFormData[K]
    ) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    const handleImageUpload = async (file: File | undefined) => {
        if (!file) return;
        setUploading(true);
        try {
            const uploaded = await uploadMedia(file, "greengrow/products");
            update("image", uploaded.secure_url);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unable to upload product image.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
                    <div>
                        <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">
                            {initialData ? "Edit Product" : "Add New Product"}
                        </h2>
                        <p className="text-xs text-slate-500">
                            Fill in the product details below
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 hover:bg-stone-100 hover:text-slate-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Image upload */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                            Product Image
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50">
                                {form.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={form.image}
                                        alt="preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Upload className="h-6 w-6 text-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploading}
                                    onChange={(e) => void handleImageUpload(e.target.files?.[0])}
                                    className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-bold file:text-emerald-700"
                                />
                                <input
                                    type="text"
                                    value={form.image}
                                    onChange={(e) => update("image", e.target.value)}
                                    placeholder="Cloudinary URL or /assets/product_1.jpeg"
                                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-650 focus:ring-2 focus:ring-emerald-100"
                                />
                                <p className="text-xs text-slate-400">{uploading ? "Uploading to Cloudinary..." : "Upload an image or paste an existing URL."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Product Name" full>
                            <input
                                required
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                placeholder="e.g. Greengrow Humic Acid 98%"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Category">
                            <select
                                value={form.category}
                                onChange={(e) => update("category", e.target.value)}
                                className={inputCls}
                            >
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Subcategory">
                            <input
                                value={form.subcategory}
                                onChange={(e) => update("subcategory", e.target.value)}
                                placeholder="e.g. Biofertilizers"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Original Price (₹)">
                            <input
                                type="number"
                                min={0}
                                value={form.originalPrice}
                                onChange={(e) => update("originalPrice", Number(e.target.value))}
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Current Price (₹)">
                            <input
                                type="number"
                                min={0}
                                value={form.currentPrice}
                                onChange={(e) => update("currentPrice", Number(e.target.value))}
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Discount (%)">
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={form.discount}
                                onChange={(e) => update("discount", Number(e.target.value))}
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Stock (units)">
                            <input
                                type="number"
                                min={0}
                                value={form.stock}
                                onChange={(e) => update("stock", Number(e.target.value))}
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Composition" full>
                            <input
                                value={form.composition}
                                onChange={(e) => update("composition", e.target.value)}
                                placeholder="e.g. Humic Acid: 80%, Fulvic Acid: 18%"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Key Crop Benefits" full>
                            <textarea
                                rows={2}
                                value={form.benefits}
                                onChange={(e) => update("benefits", e.target.value)}
                                placeholder="Comma separated, e.g. Accelerates root development, Improves soil structure"
                                className={`${inputCls} resize-none`}
                            />
                        </Field>

                        <Field label="Recommended Usage & Dosage" full>
                            <textarea
                                rows={2}
                                value={form.recommendedUsage}
                                onChange={(e) => update("recommendedUsage", e.target.value)}
                                placeholder="e.g. Soil Application: 2-3 kg per acre."
                                className={`${inputCls} resize-none`}
                            />
                        </Field>

                        <Field label="Available Packaging Sizes" full>
                            <input
                                value={form.packagingDetails}
                                onChange={(e) => update("packagingDetails", e.target.value)}
                                placeholder="Comma separated, e.g. 1 KG, 5 KG, 25 KG DRUM"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Description" full>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => update("description", e.target.value)}
                                placeholder="Short product description..."
                                className={`${inputCls} resize-none`}
                            />
                        </Field>
                    </div>

                    <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            checked={form.isSoldOut}
                            onChange={(e) => update("isSoldOut", e.target.checked)}
                            className="h-4 w-4 rounded border-stone-300 text-emerald-650 focus:ring-emerald-100"
                        />
                        Mark as Sold Out
                    </label>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-stone-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-stone-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-650 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-650/20 hover:bg-emerald-750"
                    >
                        <Save className="h-4 w-4" />
                        {initialData ? "Update" : "Save Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const inputCls =
    "w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-650 focus:ring-2 focus:ring-emerald-100";

function Field({
    label,
    children,
    full,
}: {
    label: string;
    children: React.ReactNode;
    full?: boolean;
}) {
    return (
        <div className={full ? "sm:col-span-2" : ""}>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                {label}
            </label>
            {children}
        </div>
    );
}

export { Trash2 };
