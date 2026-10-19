"use client";

import React from "react";
import {
    Bell,
    ChevronDown,
    MessageSquare,
    Search,
} from "lucide-react";

export default function DashboardHeader() {
    return (
        <header
            dir="rtl"
            className="
                flex
                h-[80px]
                w-full
                items-center
                justify-between
                border-b
                border-[#edf0f4]
                bg-white
                px-6
            "
        >
            {/* عنوان */}
            <div>
                <h2 className="text-[23px] font-bold text-[#17243a]">
                    داشبورد
                </h2>

                <p className="mt-0.5 text-[11px] text-[#718096]">
                    نمای کلی وضعیت سایت
                </p>
            </div>

            {/* بخش سمت چپ */}
            <div className="flex items-center gap-3">

                {/* Search */}
                <div
                    className="
                        relative
                        hidden
                        h-[44px]
                        w-[320px]
                        items-center
                        md:flex
                    "
                >
                    <Search
                        size={18}
                        className="
                            absolute
                            right-3.5
                            text-[#94a3b8]
                        "
                    />

                    <input
                        type="text"
                        placeholder="جستجو در پنل ادمین..."
                        className="
                            h-full
                            w-full
                            rounded-[10px]
                            border
                            border-[#e5eaf0]
                            bg-white
                            pr-10
                            pl-3
                            text-[13px]
                            text-[#26364c]
                            outline-none
                            placeholder:text-[#aab4c1]
                            focus:border-[#cbd5e1]
                        "
                    />
                </div>

                {/* پیام */}
                <button
                    className="
                        relative
                        flex
                        h-[44px]
                        w-[44px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#e6ebf1]
                        bg-white
                        transition
                        hover:bg-[#f8fafc]
                    "
                >
                    <MessageSquare
                        size={20}
                        strokeWidth={1.8}
                        className="text-[#26364c]"
                    />

                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            flex
                            h-[18px]
                            w-[18px]
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-500
                            text-[9px]
                            font-bold
                            text-white
                        "
                    >
                        2
                    </span>
                </button>

                {/* اعلان */}
                <button
                    className="
                        relative
                        flex
                        h-[44px]
                        w-[44px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#e6ebf1]
                        bg-white
                        transition
                        hover:bg-[#f8fafc]
                    "
                >
                    <Bell
                        size={21}
                        strokeWidth={1.8}
                        className="text-[#26364c]"
                    />

                    <span
                        className="
                            absolute
                            -right-1
                            -top-1
                            flex
                            h-[18px]
                            w-[18px]
                            items-center
                            justify-center
                            rounded-full
                            bg-red-500
                            text-[9px]
                            font-bold
                            text-white
                        "
                    >
                        3
                    </span>
                </button>

                {/* ادمین */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="
                            h-[42px]
                            w-[42px]
                            overflow-hidden
                            rounded-full
                            bg-[#eef2f5]
                        "
                    >
                        <img
                            src="/assets/admin.jpg"
                            alt="admin"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="hidden text-right sm:block">
                        <p className="text-[13px] font-semibold text-[#17243a]">
                            سلام ادمین
                        </p>

                        <p className="mt-0.5 text-[10px] text-[#7c8797]">
                            مدیر سیستم
                        </p>
                    </div>

                    <ChevronDown
                        size={16}
                        className="text-[#17243a]"
                    />
                </div>
            </div>
        </header>
    );
}