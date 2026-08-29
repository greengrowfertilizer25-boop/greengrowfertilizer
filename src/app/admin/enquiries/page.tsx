"use client";

import { useState } from "react";
import { Inbox, Mail, Phone, MapPin, MessageSquare, X, Trash2 } from "lucide-react";
import type { ContactEnquiry } from "@/data/adminContent";
import { updateResource } from "@/lib/client/api";
import { useResource } from "@/lib/client/useResource";

const statusStyles: Record<ContactEnquiry["status"], string> = {
  New: "bg-emerald-50 text-emerald-700",
  Read: "bg-amber-50 text-amber-700",
  Resolved: "bg-sky-50 text-sky-700",
};

export default function EnquiriesInbox() {
  const { items, setItems, error, remove: removeItem } = useResource<ContactEnquiry>("enquiries");
  const [selected, setSelected] = useState<ContactEnquiry | null>(null);
  const [filter, setFilter] = useState<"All" | ContactEnquiry["status"]>("All");

  const filtered = filter === "All" ? items : items.filter((e) => e.status === filter);

  const updateStatus = async (id: string, status: ContactEnquiry["status"]) => {
    const previousItems = items;
    const previousSelected = selected;
    const nextItems = items.map((e) => (e.id === id ? { ...e, status } : e));
    setItems(nextItems);
    setSelected((current) => (current?.id === id ? { ...current, status } : current));
    try {
      const updated = await updateResource<{ status: ContactEnquiry["status"] }>("enquiries", id, { status });
      setItems((current) => current.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      setSelected((current) => (current?.id === id ? { ...current, ...updated } : current));
    } catch {
      setItems(previousItems);
      setSelected(previousSelected);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await removeItem(id);
      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to delete the enquiry.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">Contact Enquiries</h1>
        <p className="text-sm text-slate-500">Messages submitted via the public contact form.</p>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          {error}
        </p>
      )}

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {(["All", "New", "Read", "Resolved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${filter === f ? "bg-emerald-650 text-white" : "border border-stone-200 bg-white text-slate-600 hover:bg-stone-50"}`}
          >
            {f} {f !== "All" && `(${items.filter((e) => e.status === f).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-100 bg-stone-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">ID</th>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Enquiry Type</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 text-right font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-stone-50/60">
                <td className="px-4 py-3 font-bold text-slate-900">{e.id}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-800">{e.fullName}</p>
                  <p className="text-xs text-slate-400">{e.mobileNumber}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{e.enquiryType}</td>
                <td className="px-4 py-3 text-slate-500">{e.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${statusStyles[e.status]}`}>{e.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelected(e)} className="rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-stone-50">
                      View
                    </button>
                    <button onClick={() => deleteEnquiry(e.id)} className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">No enquiries</p>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end bg-slate-900/50 backdrop-blur-sm sm:items-center sm:justify-center sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
              <div>
                <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">{selected.fullName}</h2>
                <p className="text-xs text-slate-500">{selected.id} · {selected.date}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => deleteEnquiry(selected.id)} className="rounded-xl p-2 text-rose-500 hover:bg-rose-50" title="Delete Enquiry">
                  <Trash2 className="h-5 w-5" />
                </button>
                <button onClick={() => setSelected(null)} className="rounded-xl p-2 text-slate-400 hover:bg-stone-100 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 gap-4">
                <Detail icon={MessageSquare} label="Enquiry Type" value={selected.enquiryType} />
                <Detail icon={MapPin} label="City / State" value={selected.cityState} />
                <Detail icon={Phone} label="Mobile" value={selected.mobileNumber} />
                <Detail icon={Mail} label="Email" value={selected.emailAddress} />
                {selected.farmName && <Detail icon={MapPin} label="Farm Name" value={selected.farmName} />}
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-600">Message</p>
                <p className="rounded-xl bg-stone-50 p-3 text-sm text-slate-600">{selected.message}</p>
              </div>
            </div>
            <div className="border-t border-stone-100 px-6 py-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {(["New", "Read", "Resolved"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selected.id, s)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${selected.status === s ? "bg-emerald-650 text-white" : "border border-stone-200 bg-white text-slate-600 hover:bg-stone-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
    </div>
  );
}
