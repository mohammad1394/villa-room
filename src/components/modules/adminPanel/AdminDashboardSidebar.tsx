"use client";

import React from "react";
import {
    BarChart3,
    CalendarDays,
    CreditCard,
    FileText,
    Home,
    LogOut,
    MessageCircle,
    Settings,
    Tag,
    Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import LogoutModal from "@/components/modules/LogoutModal/LogoutModal";
import { showCustomToast } from "@/components/modules/layout/toast/toast";

export default function DashboardSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    
    const menuItems = [
        {
            title: "داشبورد",
            icon: BarChart3,
            active: pathname === "/panel",
            link: "/admin-panel",
        },
        {
            title: "ویلاها",
            icon: Home,
            active: pathname === "/panel/villas",
            link: "/admin-panel/villas",
        },
        {
            title: "رزروها",
            icon: CalendarDays,
            active: pathname === "/panel/bookings",
            link: "/admin-panel/bookings",
        },
        {
            title: "کاربران",
            icon: Users,
            active: pathname === "/panel/users",
            link: "/admin-panel/users",
        },
        {
            title: "تراکنش‌ها",
            icon: CreditCard,
            active: pathname === "/panel/transactions",
            link: "/admin-panel/transactions",
        },
        {
            title: "نظرات",
            icon: MessageCircle,
            active: pathname === "/panel/reviews",
            link: "/admin-panel/reviews",
        },
        {
            title: "تیکت ها",
            icon: MessageCircle,
            active: pathname === "/panel/tickets",
            link: "/admin-panel/tickets",
        },
        {
            title: "کدهای تخفیف",
            icon: Tag,
            active: pathname === "/panel/dicounts",
            link: "/admin-panel/discounts",
        },
        {
            title: "گزارش‌ها",
            icon: FileText,
            active: pathname === "/panel/reports",
            link: "/admin-panel/reports",
        },
        {
            title: "تنظیمات",
            icon: Settings,
            active: pathname === "/panel/settings",
            link: "/admin-panel/settings",
        },
    ];

    const handleLogout = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/logout", {
                method: "DELETE",
            });

            if (response.ok) {
                showCustomToast(
                    "موفق",
                    "شما با موفقیت خارج شدید",
                    "check",
                    "success"
                );

                router.push("/");
            }
        } catch (error) {
            console.error(error);

            showCustomToast(
                "خطا",
                "خطایی هنگام خروج از حساب رخ داد",
                "x",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <aside
            dir="rtl"
            className="
                fixed
                top-0
                right-0
                z-40
                hidden
                h-screen
                w-[280px]
                flex-col
                bg-[#08233d]
                px-5
                py-7
                lg:flex
            "
        >
            {/* Logo */}
            <div className="mb-10 flex justify-center">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Home
                            size={43}
                            strokeWidth={1.7}
                            className="text-[#e5a33a]"
                        />

                        <span className="text-[25px] font-bold text-white">
                            ویلاروم
                        </span>
                    </div>

                    <p className="mt-1 text-[9px] text-gray-300">
                        پنل مدیریت
                    </p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex flex-col gap-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.title}
                            href={item.link}
                            className={`
                                flex
                                h-[52px]
                                items-center
                                gap-4
                                rounded-[10px]
                                px-5
                                text-[14px]
                                transition
                                ${
                                item.active
                                    ? "bg-white/10 text-white"
                                    : "text-gray-200 hover:bg-white/5"
                            }
                            `}
                        >
                            <Icon
                                size={23}
                                strokeWidth={1.7}
                                className={
                                    item.active
                                        ? "text-[#e5a33a]"
                                        : "text-white"
                                }
                            />

                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <button
                className="
                    mt-4
                    flex
                    h-[52px]
                    items-center
                    gap-4
                    rounded-[10px]
                    px-5
                    text-[14px]
                    text-gray-200
                    transition
                    hover:bg-white/5
                "
                onClick={() => setIsOpen(true)}
            >
                <LogOut
                    size={23}
                    strokeWidth={1.7}
                />

                <span>خروج از حساب</span>
            </button>

            {/* Logout Modal */}
            <LogoutModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onConfirm={handleLogout}
                isLoading={isLoading}
            />
        </aside>
    );
}