import React from 'react';
import {Heart} from "lucide-react";

function EmptyFavorite() {
    return (
        <div
            className="
                flex
                min-h-[400px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-[#DCE2E6]
                bg-[#FCFCFB]
                px-6
                text-center
            "
        >

            <div
                className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F5F0E9]
                "
            >
                <Heart
                    size={36}
                    strokeWidth={1.4}
                    className="text-[#C89B5B]"
                />
            </div>

            <h2
                className="
                    mt-5
                    text-[18px]
                    font-bold
                    text-[#172B3A]
                "
            >
                هنوز ویلایی به علاقه‌مندی‌ها اضافه نکرده‌اید
            </h2>

            <p
                className="
                    mt-2
                    max-w-[450px]
                    text-[12px]
                    leading-7
                    text-[#66727D]
                "
            >
                ویلاهای مورد علاقه‌تان را پیدا کنید و با زدن روی قلب،
                آن‌ها را برای سفرهای بعدی ذخیره کنید.
            </p>

            <button
                className="
                    mt-6
                    h-11
                    rounded-lg
                    bg-[#172B3A]
                    px-7
                    text-[12px]
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#213D52]
                "
            >
                مشاهده ویلاها
            </button>

        </div>
    );
}

export default EmptyFavorite;