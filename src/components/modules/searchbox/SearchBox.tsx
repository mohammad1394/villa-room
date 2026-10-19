"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchBox() {
    const router = useRouter();

    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [count, setCount] = useState("");

    const handleClick = () => {
        const params = new URLSearchParams();

        if (destination) params.set("destination", destination);
        if (checkIn) params.set("checkIn", checkIn);
        if (checkOut) params.set("checkOut", checkOut);
        if (count) params.set("count", count);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div
            className="
                relative z-20
                w-[calc(100%-32px)]
                max-w-[1100px]
                min-h-[100px]
                mx-auto
                rounded-[16px]
                bg-white
                shadow-[0_4px_20px_rgba(0,0,0,0.12)]
                flex
                items-center
                justify-between
                px-[28px]
                py-[18px]
                gap-5
                direction-rtl
                max-md:flex-col
                max-md:items-stretch
                max-md:mt-[20px]
                max-md:px-5
                max-md:py-5
            "
        >
            {/* مقصد */}
            <div className="flex flex-col gap-2 w-[220px] max-md:w-full">
                <p className="text-[14px] text-gray-500 font-medium">
                    مقصد
                </p>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="کجا میخوای بری؟"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleClick();
                            }
                        }}
                        className="
                            w-full
                            outline-none
                            text-[14px]
                            text-gray-700
                            placeholder:text-gray-300
                        "
                    />

                    <span className="text-gray-400">
                        ⌕
                    </span>
                </div>
            </div>

            {/* تاریخ ورود */}
            <div className="flex flex-col gap-2 w-[180px] max-md:w-full">
                <p className="text-[14px] text-gray-500 font-medium">
                    تاریخ ورود
                </p>

                <div className="flex items-center gap-2">
                    <input
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        type="date"
                        className="
                            w-full
                            outline-none
                            text-[14px]
                            text-gray-400
                        "
                    />
                </div>
            </div>

            {/* تاریخ خروج */}
            <div className="flex flex-col gap-2 w-[180px] max-md:w-full">
                <p className="text-[14px] text-gray-500 font-medium">
                    تاریخ خروج
                </p>

                <div className="flex items-center gap-2">
                    <input
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        type="date"
                        className="
                            w-full
                            outline-none
                            text-[14px]
                            text-gray-400
                        "
                    />
                </div>
            </div>

            {/* تعداد نفرات */}
            <div className="flex flex-col gap-2 w-[170px] max-md:w-full">
                <p className="text-[14px] text-gray-500 font-medium">
                    تعداد نفرات
                </p>

                <div className="flex items-center gap-2">
                    <input
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        type="number"
                        placeholder="انتخاب کنید"
                        className="
                            w-full
                            outline-none
                            text-[14px]
                            text-gray-300
                        "
                    />

                    <span className="text-gray-400">
                        ♙
                    </span>
                </div>
            </div>

            {/* دکمه جستجو */}
            <button
                onClick={handleClick}
                className="
                    w-[125px]
                    h-[52px]
                    shrink-0

                    rounded-[10px]
                    bg-[var(--primary)]
                    text-white
                    font-medium

                    hover:opacity-90
                    transition

                    max-md:w-full
                "
            >
                جستجو
            </button>
        </div>
    );
}

export default SearchBox;