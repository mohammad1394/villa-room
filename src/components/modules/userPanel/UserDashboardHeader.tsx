"use client";

import React from "react";
import { Bell, Search, Settings } from "lucide-react";

export default function UserDashboardHeader() {
    return (
        <header
            className="
                pt-5
                px-5
                flex flex-col-reverse
                gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            {/* Search */}
            <div className="relative w-full sm:w-[380px]">
                <Search
                    size={20}
                    className="
                        absolute right-4 top-1/2
                        -translate-y-1/2
                        text-[#233f59]
                    "
                />

                <input
                    type="text"
                    placeholder="جستجو در ویلاها..."
                    className="
                        h-[48px] w-full
                        rounded-[10px]
                        border border-gray-200
                        bg-white
                        pr-12 pl-4
                        text-[12px]
                        outline-none
                        transition
                        focus:border-[#d9a13b]
                    "
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
                <button
                    className="
                        relative flex
                        h-[48px] w-[48px]
                        items-center justify-center
                        rounded-full
                        border border-gray-200
                        bg-white
                    "
                >
                    <Bell
                        size={21}
                        className="text-[#17334d]"
                    />

                    <span
                        className="
                            absolute -right-1 -top-1
                            flex h-[20px] w-[20px]
                            items-center justify-center
                            rounded-full
                            bg-[#d99a2e]
                            text-[10px]
                            text-white
                        "
                    >
                        3
                    </span>
                </button>

                <button
                    className="
                        flex h-[48px] w-[48px]
                        items-center justify-center
                        rounded-full
                        border border-gray-200
                        bg-white
                    "
                >
                    <Settings
                        size={21}
                        className="text-[#17334d]"
                    />
                </button>
            </div>
        </header>
    );
}