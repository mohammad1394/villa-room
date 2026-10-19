"use client";

import React, {useState} from "react";
import {
    CalendarDays,
    MapPin,
    User,
} from "lucide-react";

function SideBarFilter() {

    const MIN = 500000;
    const MAX = 10000000;
    const STEP = 100000;

    const [minPrice, setMinPrice] = useState(MIN);
    const [maxPrice, setMaxPrice] = useState(MAX);

    const minPercent =
        ((minPrice - MIN) / (MAX - MIN)) * 100;

    const maxPercent =
        ((maxPrice - MIN) / (MAX - MIN)) * 100;


    return (
        <div
            className="
                flex
                w-full
                flex-col
                gap-6
                rounded-[16px]
                border
                border-[#E1E5E8]
                bg-white
                p-5
                sm:p-6
                lg:w-full
            "
        >

            {/* عنوان */}
            <h3 className="text-[16px] font-bold text-[#172B3A]">
                فیلتر
            </h3>


            {/* مقصد */}
            <div className="flex flex-col gap-3">

                <label className="text-[13px] font-medium text-[#45515B]">
                    مقصد
                </label>

                <div className="flex w-full">

                    <input
                        type="text"
                        className="
                            h-[44px]
                            min-w-0
                            flex-1
                            rounded-r-[10px]
                            border
                            border-[#E1E5E8]
                            px-3
                            text-[13px]
                            outline-none
                            focus:border-[#203140]
                        "
                    />

                    <div
                        className="
                            flex
                            h-[44px]
                            w-[46px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-l-[10px]
                            border
                            border-r-0
                            border-[#E1E5E8]
                            text-[#66727D]
                        "
                    >
                        <MapPin size={18}/>
                    </div>

                </div>
            </div>


            {/* تاریخ ورود */}
            <div className="flex flex-col gap-3">

                <label className="text-[13px] font-medium text-[#45515B]">
                    تاریخ ورود
                </label>

                <div className="flex w-full">

                    <input
                        type="date"
                        className="
                            h-[44px]
                            min-w-0
                            flex-1
                            rounded-r-[10px]
                            border
                            border-[#E1E5E8]
                            px-3
                            text-[12px]
                            outline-none
                            focus:border-[#203140]
                        "
                    />

                    <div
                        className="
                            flex
                            h-[44px]
                            w-[46px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-l-[10px]
                            border
                            border-r-0
                            border-[#E1E5E8]
                            text-[#66727D]
                        "
                    >
                        <CalendarDays size={18}/>
                    </div>

                </div>
            </div>


            {/* تاریخ خروج */}
            <div className="flex flex-col gap-3">

                <label className="text-[13px] font-medium text-[#45515B]">
                    تاریخ خروج
                </label>

                <div className="flex w-full">

                    <input
                        type="date"
                        className="
                            h-[44px]
                            min-w-0
                            flex-1
                            rounded-r-[10px]
                            border
                            border-[#E1E5E8]
                            px-3
                            text-[12px]
                            outline-none
                            focus:border-[#203140]
                        "
                    />

                    <div
                        className="
                            flex
                            h-[44px]
                            w-[46px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-l-[10px]
                            border
                            border-r-0
                            border-[#E1E5E8]
                            text-[#66727D]
                        "
                    >
                        <CalendarDays size={18}/>
                    </div>

                </div>
            </div>


            {/* تعداد نفرات */}
            <div className="flex flex-col gap-3">

                <label className="text-[13px] font-medium text-[#45515B]">
                    تعداد نفرات
                </label>

                <div className="flex w-full">

                    <input
                        type="number"
                        min="1"
                        className="
                            h-[44px]
                            min-w-0
                            flex-1
                            rounded-r-[10px]
                            border
                            border-[#E1E5E8]
                            px-3
                            text-[13px]
                            outline-none
                            focus:border-[#203140]
                        "
                    />

                    <div
                        className="
                            flex
                            h-[44px]
                            w-[46px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-l-[10px]
                            border
                            border-r-0
                            border-[#E1E5E8]
                            text-[#66727D]
                        "
                    >
                        <User size={18}/>
                    </div>

                </div>
            </div>


            <hr className="border-[#E1E5E8]"/>


            {/* قیمت */}
            <div className="w-full">

                <label className="mb-5 block text-[14px] font-bold text-[#172B3A]">
                    قیمت
                </label>

                {/* Slider */}
                <div className="relative h-5">

                    <div
                        className="
                            absolute
                            top-1/2
                            h-[4px]
                            w-full
                            -translate-y-1/2
                            rounded-full
                            bg-gray-200
                        "
                    />

                    <div
                        className="
                            absolute
                            top-1/2
                            h-[4px]
                            -translate-y-1/2
                            rounded-full
                            bg-[var(--text-primary)]
                        "
                        style={{
                            right: `${100 - maxPercent}%`,
                            left: `${minPercent}%`,
                        }}
                    />

                    {/* حداقل */}
                    <input
                        type="range"
                        min={MIN}
                        max={MAX}
                        step={STEP}
                        value={minPrice}
                        onChange={(e) => {
                            const value = Number(e.target.value);

                            if (value < maxPrice) {
                                setMinPrice(value);
                            }
                        }}
                        className="range-slider absolute inset-0 w-full"
                    />

                    {/* حداکثر */}
                    <input
                        type="range"
                        min={MIN}
                        max={MAX}
                        step={STEP}
                        value={maxPrice}
                        onChange={(e) => {
                            const value = Number(e.target.value);

                            if (value > minPrice) {
                                setMaxPrice(value);
                            }
                        }}
                        className="range-slider absolute inset-0 w-full"
                    />

                </div>


                {/* قیمت‌ها */}
                <div className="mt-4 grid grid-cols-2 gap-2">

                    <div
                        className="
                            min-w-0
                            rounded-lg
                            border
                            border-gray-200
                            px-2
                            py-2
                            text-center
                            text-[11px]
                            sm:text-[12px]
                        "
                    >
                        {minPrice.toLocaleString("fa-IR")}
                        {" "}تومان
                    </div>

                    <div
                        className="
                            min-w-0
                            rounded-lg
                            border
                            border-gray-200
                            px-2
                            py-2
                            text-center
                            text-[11px]
                            sm:text-[12px]
                        "
                    >
                        {maxPrice.toLocaleString("fa-IR")}
                        {" "}تومان
                    </div>

                </div>
            </div>


            <hr className="border-[#E1E5E8]"/>


            {/* امکانات */}
            <div className="flex flex-col gap-3">

                <label className="text-[14px] font-bold text-[#172B3A]">
                    امکانات
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#45515B]">
                    <input type="checkbox"/>
                    استخر
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#45515B]">
                    <input type="checkbox"/>
                    آسانسور
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#45515B]">
                    <input type="checkbox"/>
                    باربیکیو
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#45515B]">
                    <input type="checkbox"/>
                    پارکینگ
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#45515B]">
                    <input type="checkbox"/>
                    کولر گازی
                </label>

            </div>


            {/* دکمه */}
            <button
                className="
                    h-[44px]
                    w-full
                    rounded-[10px]
                    bg-[var(--primary)]
                    text-[13px]
                    font-medium
                    text-white
                    transition
                    hover:bg-[var(--primary-hover)]
                "
            >
                اعمال فیلتر
            </button>

        </div>
    );
}

export default SideBarFilter;