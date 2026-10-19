"use client";

import React, {useState} from "react";
import Image from "next/image";
import {
    Home,
    Star,
    Users,
    Eye,
    EyeOff,
    Mail,
    Lock, ArrowBigLeft,
} from "lucide-react";
import Link from "next/link";

function Page() {

    return (
        <div
            dir="rtl"
            className="relative min-h-screen bg-[var(--surface-secondary)]"
        >
            <div
                className="m-3 grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl sm:m-5 md:m-8 md:grid-cols-[58%_42%] lg:m-10"
            >

                {/*form section */}
                <div
                    className="w-full bg-white p-5 sm:p-8 lg:p-[48px]"
                >
                    <div
                        className="mx-auto flex w-full max-w-[460px] flex-col gap-6"
                    >

                        {/* Logo */}
                        <div className="text-center">
                            <Link
                                href="/public"
                                className="text-[22px] font-bold text-[var(--primary)] sm:text-[24px]"
                            >
                                ویلا روم
                            </Link>
                        </div>


                        {/* Form Title */}
                        <div
                            className="flex flex-col items-center gap-3 sm:gap-4"
                        >
                            <h1
                                className="text-center text-[22px] font-bold text-[var(--text-primary)] sm:text-[26px]"
                            >
                                فراموشی رمز عبور
                            </h1>

                            <p
                                className="text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]"
                            >
                                شماره موبایل یاایمیل خود را وارد کنید تا کد تایید برای شما ارسال شود.
                            </p>
                        </div>


                        {/*forgot password*/}
                        <form className="flex flex-col gap-5">

                            {/* Email / Phone */}
                            <div className="flex w-full flex-col">

                                <label
                                    htmlFor="email"
                                    className="text-[13px] font-bold text-[var(--text-primary)]"
                                >
                                    ایمیل یا شماره تلفن
                                </label>

                                <div className="relative mt-2">

                                    <Mail
                                        size={18}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                    />

                                    <input
                                        id="email"
                                        type="text"
                                        placeholder="ایمیل یا شماره تلفن خود را وارد کنید"
                                        className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />

                                </div>

                            </div>


                            {/* confirm Button */}
                            <button
                                type="submit"
                                className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                            >
                                ارسال کد تایید
                            </button>

                        </form>


                        {/* Back to Login Page */}
                        <div
                            className="flex justify-center gap-1 text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]"
                        >

                            <Link
                                href="/login"
                                className="flex font-bold text-[var(--text-primary)] hover:underline"
                            >
                                بازگست به صفحه ورود <ArrowBigLeft/>
                            </Link>

                        </div>

                    </div>
                </div>


                {/*Image section */}
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


                    {/* Image Content */}
                    <div
                        className="relative flex w-full flex-col"
                    >

                        <div
                            className="flex w-full max-w-[500px] flex-col"
                        >

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


                        {/* Statistics */}
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

            </div>
        </div>
    );
}

export default Page;