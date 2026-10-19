"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Home,
    Star,
    Users,
    Eye,
    EyeOff,
    Lock,
    ArrowBigLeft,
} from "lucide-react";
import Link from "next/link";

function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div
            dir="rtl"
            className="
                relative
                min-h-screen
                bg-[var(--surface-secondary)]
            "
        >
            <div
                className="
                    m-3
                    grid
                    min-h-[650px]
                    grid-cols-1
                    overflow-hidden
                    rounded-xl

                    sm:m-5
                    md:m-8
                    lg:m-10

                    md:grid-cols-[58%_42%]
                "
            >
                {/* فرم */}

                <div
                    className="
                        w-full
                        bg-white
                        p-5

                        sm:p-8
                        lg:p-[48px]
                    "
                >
                    <div
                        className="
                            mx-auto
                            flex
                            w-full
                            max-w-[460px]
                            flex-col
                            gap-6
                        "
                    >
                        {/* لوگو */}

                        <div className="text-center">
                            <Link
                                href="/"
                                className="
                                    text-[22px]
                                    font-bold
                                    text-[var(--primary)]

                                    sm:text-[24px]
                                "
                            >
                                ویلا روم
                            </Link>
                        </div>

                        {/* عنوان */}

                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                gap-3

                                sm:gap-4
                            "
                        >
                            <h1
                                className="
                                    text-center
                                    text-[22px]
                                    font-bold
                                    text-[var(--text-primary)]

                                    sm:text-[26px]
                                "
                            >
                                ایجاد رمز عبور
                            </h1>

                            <p
                                className="
                                    text-center
                                    text-[13px]
                                    text-[var(--text-secondary)]

                                    sm:text-[14px]
                                "
                            >
                                لطفاً رمز عبور جدید خود را وارد کنید
                            </p>
                        </div>

                        {/* فرم رمز عبور */}

                        <form className="flex flex-col gap-5">

                            {/* رمز عبور */}

                            <div className="flex w-full flex-col">
                                <label
                                    htmlFor="password"
                                    className="
                                        font-bold
                                        text-[13px]
                                        text-[var(--text-primary)]
                                    "
                                >
                                    رمز عبور
                                </label>

                                <div className="relative mt-2">
                                    <Lock
                                        size={18}
                                        strokeWidth={1.8}
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-[var(--text-secondary)]
                                        "
                                    />

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="رمز عبور جدید خود را وارد کنید"
                                        className="
                                            h-[48px]
                                            w-full
                                            rounded-[9px]
                                            border
                                            border-[var(--border)]
                                            bg-white
                                            px-[42px]
                                            text-[13px]
                                            text-[var(--text-primary)]
                                            outline-none
                                            transition

                                            placeholder:text-[var(--text-secondary)]

                                            focus:border-[var(--primary)]
                                            focus:ring-2
                                            focus:ring-[var(--primary)]/10
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "مخفی کردن رمز عبور"
                                                : "نمایش رمز عبور"
                                        }
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-[var(--text-secondary)]
                                            transition

                                            hover:text-[var(--primary)]
                                        "
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* تکرار رمز عبور */}

                            <div className="flex w-full flex-col">
                                <label
                                    htmlFor="confirmPassword"
                                    className="
                                        font-bold
                                        text-[13px]
                                        text-[var(--text-primary)]
                                    "
                                >
                                    تکرار رمز عبور
                                </label>

                                <div className="relative mt-2">
                                    <Lock
                                        size={18}
                                        strokeWidth={1.8}
                                        className="
                                            absolute
                                            right-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-[var(--text-secondary)]
                                        "
                                    />

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder="رمز عبور جدید را دوباره وارد کنید"
                                        className="
                                            h-[48px]
                                            w-full
                                            rounded-[9px]
                                            border
                                            border-[var(--border)]
                                            bg-white
                                            px-[42px]
                                            text-[13px]
                                            text-[var(--text-primary)]
                                            outline-none
                                            transition

                                            placeholder:text-[var(--text-secondary)]

                                            focus:border-[var(--primary)]
                                            focus:ring-2
                                            focus:ring-[var(--primary)]/10
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "مخفی کردن تکرار رمز عبور"
                                                : "نمایش تکرار رمز عبور"
                                        }
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-[var(--text-secondary)]
                                            transition

                                            hover:text-[var(--primary)]
                                        "
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* قوانین رمز */}

                            <div
                                className="
                                    rounded-[9px]
                                    bg-[var(--surface-secondary)]
                                    px-4
                                    py-3
                                    text-[12px]
                                    leading-6
                                    text-[var(--text-secondary)]
                                "
                            >
                                <p
                                    className="
                                        mb-1
                                        font-bold
                                        text-[var(--text-primary)]
                                    "
                                >
                                    رمز عبور باید:
                                </p>

                                <ul className="list-disc pr-4">
                                    <li>
                                        حداقل ۸ کاراکتر باشد.
                                    </li>

                                    <li>
                                        شامل حروف و عدد باشد.
                                    </li>
                                </ul>
                            </div>

                            {/* دکمه تغییر رمز */}

                            <button
                                type="submit"
                                className="
                                    h-[48px]
                                    w-full
                                    rounded-[9px]
                                    bg-[var(--primary)]
                                    text-[14px]
                                    font-bold
                                    text-white
                                    transition

                                    hover:bg-[var(--primary-hover)]

                                    active:scale-[0.99]
                                "
                            >
                                تغییر رمز عبور
                            </button>
                        </form>

                        {/* بازگشت به ورود */}

                        <div
                            className="
                                flex
                                justify-center
                                text-center
                                text-[13px]
                                text-[var(--text-secondary)]

                                sm:text-[14px]
                            "
                        >
                            <Link
                                href="/login"
                                className="
                                    flex
                                    items-center
                                    gap-1
                                    font-bold
                                    text-[var(--text-primary)]
                                    transition

                                    hover:underline
                                "
                            >
                                بازگشت به صفحه ورود

                                <ArrowBigLeft size={17} />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* تصویر */}

                <div
                    className="
                        relative
                        hidden
                        min-h-[650px]
                        w-full
                        flex-col
                        justify-center
                        overflow-hidden
                        rounded-l-2xl
                        p-8

                        md:flex
                        lg:p-[48px]
                    "
                >
                    <Image
                        src="/assets/herobg.jpg"
                        alt="ویلا"
                        fill
                        priority
                        className="object-cover"
                    />

                    {/* لایه روی تصویر */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-[rgba(20,30,40,0.35)]
                        "
                    />

                    {/* متن تصویر */}

                    <div
                        className="
                            relative
                            flex
                            w-full
                            flex-col
                        "
                    >
                        <div
                            className="
                                flex
                                w-full
                                max-w-[500px]
                                flex-col
                            "
                        >
                            <h2
                                className="
                                    text-[26px]
                                    font-bold
                                    leading-[1.8]
                                    text-white

                                    lg:text-[32px]
                                "
                            >
                                به راحتی بهترین ویلاها
                                <br />
                                را رزرو کنید
                            </h2>

                            <p
                                className="
                                    text-[14px]
                                    leading-7
                                    text-white

                                    lg:text-[16px]
                                "
                            >
                                ویلاهای لوکس و اقامتگاه‌های خاص
                                <br />
                                در بهترین مقاصد ایران در انتظار شماست.
                            </p>
                        </div>

                        {/* آمار */}

                        <div
                            className="
                                mx-auto
                                mt-12
                                grid
                                h-[120px]
                                w-full
                                grid-cols-3
                                rounded-[16px]
                                border
                                border-[rgba(255,255,255,.2)]
                                bg-white/10
                                py-4
                                text-white
                                backdrop-blur-[12px]

                                lg:mt-20
                            "
                        >
                            {/* تجربه */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-1
                                    border-l
                                    px-2

                                    sm:px-5
                                "
                            >
                                <Star size={22} />

                                <p className="font-bold">
                                    +5
                                </p>

                                <p className="text-[12px] sm:text-[14px]">
                                    سال تجربه
                                </p>
                            </div>

                            {/* کاربران */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-1
                                    border-l
                                    px-2

                                    sm:px-5
                                "
                            >
                                <Users size={22} />

                                <p className="font-bold">
                                    150,000
                                </p>

                                <p className="text-center text-[12px] sm:text-[14px]">
                                    کاربر خوشحال
                                </p>
                            </div>

                            {/* ویلاها */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    gap-1
                                    px-2

                                    sm:px-5
                                "
                            >
                                <Home size={22} />

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