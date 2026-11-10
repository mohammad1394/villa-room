import React from 'react';
import Image from "next/image";
import {Home, Star, Users} from "lucide-react";

function RegisterImageSection() {
    return (
        <div
            className="relative hidden min-h-[650px] w-full flex-col justify-center overflow-hidden rounded-l-2xl p-8 md:flex lg:p-[48px]"
        >
            <Image
                src="/assets/herobg.jpg"
                alt="ویلا"
                fill
                priority
                className="object-cover"
            />

            {/* Overlay */}

            <div
                className="absolute inset-0 bg-[rgba(20,30,40,0.35)]"
            />

            {/* Content */}

            <div
                className="relative flex w-full flex-col"
            >
                <div className="flex w-full flex-col">
                    <h2
                        className="text-[26px] leading-[1.8] font-bold text-white lg:text-[32px]"
                    >
                        به راحتی بهترین ویلاها
                        <br/>
                        را رزرو کنید
                    </h2>

                    <p
                        className="text-[14px] leading-7 text-white lg:text-[16px]"
                    >
                        ویلاهای لوکس و اقامتگاه‌های خاص
                        <br/>
                        در بهترین مقاصد ایران در انتظار شماست.
                    </p>
                </div>

                {/* =========================
                            Statistics
                        ========================== */}

                <div
                    className="mx-auto mt-12 grid h-[120px] w-full grid-cols-3 rounded-[16px] border border-[rgba(255,255,255,.2)] bg-white/10 py-4 text-white backdrop-blur-[12px] lg:mt-20"
                >
                    {/* Experience */}

                    <div
                        className="flex flex-col items-center justify-center gap-1 border-l px-2 sm:px-5"
                    >
                        <Star size={22}/>

                        <p className="font-bold">
                            +5
                        </p>

                        <p className="text-[12px] sm:text-[14px]">
                            سال تجربه
                        </p>
                    </div>

                    {/* Users */}

                    <div
                        className="flex flex-col items-center justify-center gap-1 border-l px-2 sm:px-5"
                    >
                        <Users size={22}/>

                        <p className="font-bold">
                            150,000
                        </p>

                        <p className="text-center text-[12px] sm:text-[14px]">
                            کاربر خوشحال
                        </p>
                    </div>

                    {/* Villas */}

                    <div
                        className="flex flex-col items-center justify-center gap-1 px-2 sm:px-5"
                    >
                        <Home size={22}/>

                        <p className="font-bold">
                            2,000
                        </p>

                        <p className="text-[12px] sm:text-[14px]">
                            ویلا
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterImageSection;