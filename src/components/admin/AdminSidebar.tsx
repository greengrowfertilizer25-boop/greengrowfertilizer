"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Image as ImageIcon,
    Tags,
    Sprout,
    Package,
    Newspaper,
    Building2,
    Phone,
    Inbox,
    Users,
    Leaf,
    LogOut,
    X,
    Info
} from "lucide-react";

interface AdminSidebarProps {
    open: boolean;
    onClose: () => void;
}

const navGroups = [
    {
        label: "Overview",
        items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
        label: "Homepage Content",
        items: [
            { name: "Hero Slides", href: "/admin/hero", icon: ImageIcon },
            { name: "About Us", href: "/admin/about", icon: Info },
            { name: "Categories", href: "/admin/categories", icon: Tags },
            { name: "Crops", href: "/admin/crops", icon: Sprout },
            { name: "D2C Section", href: "/admin/d2c", icon: Building2 },
            { name: "Blogs", href: "/admin/blogs", icon: Newspaper },
        ],
    },
    {
        label: "Catalog",
        items: [{ name: "Products", href: "/admin/products", icon: Package }],
    },
    {
        label: "Inbox",
        items: [
            { name: "Dealer Applications", href: "/admin/dealers", icon: Users },
            { name: "Contact Enquiries", href: "/admin/enquiries", icon: Inbox },
        ],
    },
    {
        label: "Settings",
        items: [{ name: "Contact Details", href: "/admin/contact-details", icon: Phone }],
    },
];

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 z-50 lg:z-30 h-screen w-72 shrink-0 transform overflow-y-auto bg-emerald-950 text-emerald-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-full flex-col">
                    {/* Brand */}
                    <div className="flex items-center justify-between gap-2 border-b border-emerald-900/60 px-6 py-5">
                        <Link href="/admin" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-650 shadow-lg shadow-emerald-900/40">
                                <Leaf className="h-5 w-5 text-white" />
                            </div>
                            <div className="leading-tight">
                                <span className="block text-sm font-black tracking-tight text-white">
                                    GREENGROW
                                </span>
                                <span className="block text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                                    Admin Panel
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-emerald-300 hover:bg-emerald-900 lg:hidden"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="admin-dark-scroll flex-1 space-y-5 overflow-y-auto px-3 py-5">
                        {navGroups.map((group) => (
                            <div key={group.label}>
                                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">
                                    {group.label}
                                </p>
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive =
                                            item.href === "/admin"
                                                ? pathname === "/admin"
                                                : pathname.startsWith(item.href);
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={onClose}
                                                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${isActive
                                                    ? "bg-emerald-650 text-white shadow-lg shadow-emerald-900/30"
                                                    : "text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white"
                                                    }`}
                                            >
                                                <Icon className="h-[18px] w-[18px]" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-emerald-900/60 p-3">
                        <Link
                            href="/admin/login"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-200/80 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                        >
                            <LogOut className="h-[18px] w-[18px]" />
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
