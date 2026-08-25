"use client";

import { useState, useMemo, useEffect } from "react";
import type { Product } from "@/data/products";
import ProductModal, {
    type ProductFormData,
} from "@/components/admin/ProductModal";
import { Plus, Search, Pencil, Trash2, Package, AlertCircle } from "lucide-react";
import { createResource, deleteResource, listResource, updateResource } from "@/lib/client/api";

interface RowProduct extends ProductFormData {
    uid: string;
    rating: number;
    reviews: number;
}

const toRow = (p: Product & { stock?: number }): RowProduct => ({
    uid: p.id,
    name: p.name,
    category: p.category,
    subcategory: p.subcategory ?? "",
    description: p.description,
    composition: p.composition,
    originalPrice: p.originalPrice,
    currentPrice: p.currentPrice,
    discount: p.discount,
    stock: p.stock ?? (p.reviews > 500 ? 120 : 40),
    image: p.image,
    isSoldOut: p.isSoldOut ?? false,
    rating: p.rating,
    reviews: p.reviews,
    benefits: Array.isArray(p.benefits) ? p.benefits.join(", ") : "",
    recommendedUsage: p.recommendedUsage || "",
    packagingDetails: Array.isArray(p.packagingDetails) ? p.packagingDetails.join(", ") : "",
});

export default function AdminProductsPage() {
    const [rows, setRows] = useState<RowProduct[]>([]);
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<RowProduct | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<RowProduct | null>(null);
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        listResource<Product & { stock?: number }>("products")
            .then((products) => {
                setRows(products.map(toRow));
                setApiError(null);
            })
            .catch((error: unknown) => {
                setRows([]);
                setApiError(error instanceof Error ? error.message : "Unable to load products.");
            });
    }, []);

    const categories = useMemo(
        () => ["All", ...Array.from(new Set(rows.map((r) => r.category)))],
        [rows]
    );

    const filtered = useMemo(() => {
        return rows.filter((r) => {
            const matchesQuery = r.name
                .toLowerCase()
                .includes(query.toLowerCase());
            const matchesCat =
                categoryFilter === "All" || r.category === categoryFilter;
            return matchesQuery && matchesCat;
        });
    }, [rows, query, categoryFilter]);

    const openAdd = () => {
        setEditing(null);
        setModalOpen(true);
    };

    const openEdit = (row: RowProduct) => {
        setEditing(row);
        setModalOpen(true);
    };

    const handleSave = async (data: ProductFormData) => {
        try {
            const { benefits, packagingDetails, ...restData } = data;
            const payload = {
                ...restData,
                id: editing?.uid || data.id || `product-${Date.now()}`,
                benefits: benefits ? benefits.split(",").map(s => s.trim()).filter(Boolean) : [],
                recommendedUsage: data.recommendedUsage || "",
                packagingDetails: packagingDetails ? packagingDetails.split(",").map(s => s.trim()).filter(Boolean) : [],
                rating: editing?.rating ?? 0,
                reviews: editing?.reviews ?? 0,
            };
            const saved = editing
                ? await updateResource("products", editing.uid, payload)
                : await createResource("products", payload);
            const row: RowProduct = {
                ...data,
                uid: String(saved.id),
                rating: Number(saved.rating ?? 0),
                reviews: Number(saved.reviews ?? 0),
            };
            setRows((prev) => editing ? prev.map((r) => (r.uid === editing.uid ? row : r)) : [row, ...prev]);
            setModalOpen(false);
            setEditing(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unable to save product.");
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await deleteResource("products", confirmDelete.uid);
            setRows((prev) => prev.filter((r) => r.uid !== confirmDelete.uid));
            setConfirmDelete(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unable to delete product.");
        }
    };

    const handleClearAll = async () => {
        if (!confirm("Are you sure you want to delete ALL products from your catalog?")) return;
        try {
            for (const r of rows) {
                await deleteResource("products", r.uid);
            }
            setRows([]);
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unable to clear all products.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Products</h1>
                    <p className="text-sm text-slate-500">{rows.length} products in your catalog</p>
                </div>
                <div className="flex items-center gap-2">
                    {rows.length > 0 && (
                        <button onClick={handleClearAll} className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100">
                            Clear All ({rows.length})
                        </button>
                    )}
                    <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-emerald-650 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-650/20 hover:bg-emerald-750">
                        <Plus className="h-4 w-4" /> Add Product
                    </button>
                </div>
            </div>

            {apiError && <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">{apiError}</p>}

            {/* Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 sm:max-w-xs">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-650"
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 bg-stone-50/60 text-xs uppercase tracking-wide text-slate-400">
                                <th className="px-5 py-3.5 font-bold">Product</th>
                                <th className="px-5 py-3.5 font-bold">Category</th>
                                <th className="px-5 py-3.5 font-bold">Price</th>
                                <th className="px-5 py-3.5 font-bold">Stock</th>
                                <th className="px-5 py-3.5 font-bold">Status</th>
                                <th className="px-5 py-3.5 text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r) => (
                                <tr key={r.uid} className="border-b border-stone-50 transition-colors last:border-0 hover:bg-stone-50/60">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                                                {r.image && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0 max-w-[260px]">
                                                <p className="truncate font-bold text-slate-800">{r.name}</p>
                                                <p className="truncate text-xs text-slate-400">{r.subcategory || "—"}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{r.category}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="font-bold text-slate-800">₹{r.currentPrice.toLocaleString("en-IN")}</div>
                                        {r.originalPrice > r.currentPrice && (
                                            <div className="text-xs text-slate-400 line-through">₹{r.originalPrice.toLocaleString("en-IN")}</div>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-sm font-bold ${r.stock > 50 ? "text-emerald-600" : r.stock > 0 ? "text-amber-600" : "text-rose-500"}`}>
                                            {r.stock}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {r.isSoldOut ? (
                                            <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">Sold Out</span>
                                        ) : (
                                            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Active</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(r)} className="rounded-lg border border-stone-200 p-2 text-slate-600 hover:bg-emerald-50 hover:text-emerald-650" aria-label="Edit">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => setConfirmDelete(r)} className="rounded-lg border border-stone-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
                            <Package className="h-7 w-7 text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">No products found</p>
                        <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            <ProductModal
                key={editing?.uid ?? "new-product"}
                open={modalOpen}
                initialData={editing}
                onClose={() => { setModalOpen(false); setEditing(null); }}
                onSave={handleSave}
            />

            {/* Delete confirm */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                            <AlertCircle className="h-6 w-6 text-rose-500" />
                        </div>
                        <h3 className="text-center font-display text-lg font-extrabold text-slate-900">Delete product?</h3>
                        <p className="mt-1.5 text-center text-sm text-slate-500">&ldquo;{confirmDelete.name}&rdquo; will be permanently removed.</p>
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-stone-50">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-600">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
