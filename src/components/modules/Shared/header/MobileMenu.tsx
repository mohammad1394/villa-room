"use client";

import {useState} from "react";
import Link from "next/link";
import {Menu, X, Home, Building2, HelpCircle, Info, Phone} from "lucide-react";

const menuItems = [
    {
        title: "خانه",
        href: "/",
        icon: Home,
    },
    {
        title: "ویلاها",
        href: "/villas",
        icon: Building2,
    },
    {
        title: "ورود",
        href: "/login",
        icon: Home,
    },
    {
        title: "ثبت نام",
        href: "/register",
        icon: Home,
    },
    {
        title: "راهنما",
        href: "/guide",
        icon: HelpCircle,
    },
    {
        title: "درباره ما",
        href: "/about",
        icon: Info,
    },
    {
        title: "تماس با ما",
        href: "/contact-us",
        icon: Phone,
    },
];

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden">
            {/* Menu Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200"
                aria-label="باز کردن منو"
                aria-expanded={isOpen}
            >
                <Menu size={22}/>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40"
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-dvh w-[280px] bg-white p-5 shadow-xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
                dir="rtl"
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
                    <span className="text-lg font-bold text-[var(--primary)]">
                        Villa Room
                    </span>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100"
                        aria-label="بستن منو"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Links */}
                <nav className="flex flex-col gap-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-[var(--surface-secondary)] hover:text-[var(--primary)]"
                            >
                                <Icon size={19}/>
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
