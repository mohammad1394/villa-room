"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    Home,
    Star,
    Users,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

function Page() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(108);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer
    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTimer = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;
    };

    const handleChange = (
        value: string,
        index: number
    ) => {
        // فقط عدد
        const numericValue = value.replace(/\D/g, "");

        if (!numericValue) {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = numericValue[0];

        setOtp(newOtp);

        // رفتن به input بعدی
        if (
            index < otp.length - 1 &&
            numericValue[0]
        ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        // Backspace
        if (e.key === "Backspace") {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
                return;
            }

            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }

        // Arrow Right
        if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Arrow Left
        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (
        e: React.ClipboardEvent<HTMLInputElement>
    ) => {
        e.preventDefault();

        const pastedValue = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedValue) return;

        const newOtp = [...otp];

        pastedValue.split("").forEach((digit, index) => {
            newOtp[index] = digit;
        });

        setOtp(newOtp);

        const nextIndex = Math.min(
            pastedValue.length,
            5
        );

        inputRefs.current[nextIndex]?.focus();
    };

    const handleResend = () => {
        if (timer > 0) return;

        setOtp(["", "", "", "", "", ""]);
        setTimer(108);

        inputRefs.current[0]?.focus();

        // بعداً API ارسال مجدد OTP را اینجا قرار بده
    };

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const code = otp.join("");

        if (code.length !== 6) {
            return;
        }


    };

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
                {/* =========================
                    OTP Form Section
                ========================== */}

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
                        {/* Logo */}

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

                        {/* =========================
                            Title
                        ========================== */}

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
                                تایید شماره همراه
                            </h1>

                            <p
                                className="
                                    text-center
                                    text-[13px]
                                    leading-7
                                    text-[var(--text-secondary)]

                                    sm:text-[14px]
                                "
                            >
                                کد ۶ رقمی ارسال شده به شماره
                                <br />

                                <span
                                    dir="ltr"
                                    className="
                                        inline-block
                                        font-medium
                                        text-[var(--text-primary)]
                                    "
                                >
                                    0912****2247
                                </span>

                                {" "}را وارد کنید
                            </p>
                        </div>

                        {/* =========================
                            OTP Form
                        ========================== */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                flex
                                flex-col
                                gap-5
                            "
                        >
                            {/* OTP Inputs */}

                            <div
                                dir="ltr"
                                className="
                                    flex
                                    w-full
                                    justify-center
                                    gap-2

                                    sm:gap-3
                                "
                            >
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(element) => {
                                            inputRefs.current[index] =
                                                element;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete={
                                            index === 0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleChange(
                                                e.target.value,
                                                index
                                            )
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(
                                                e,
                                                index
                                            )
                                        }
                                        onPaste={handlePaste}
                                        aria-label={`رقم ${index + 1} کد تایید`}
                                        className="
                                            h-[52px]
                                            w-[44px]
                                            rounded-[10px]
                                            border
                                            border-[var(--border)]
                                            bg-white
                                            text-center
                                            text-[20px]
                                            font-bold
                                            text-[var(--text-primary)]
                                            outline-none
                                            transition

                                            focus:border-[var(--primary)]
                                            focus:ring-2
                                            focus:ring-[var(--primary)]/10

                                            sm:h-[56px]
                                            sm:w-[50px]
                                        "
                                    />
                                ))}
                            </div>

                            {/* Timer */}

                            <div
                                className="
                                    flex
                                    justify-center
                                    text-center
                                    text-[13px]
                                    text-[var(--text-secondary)]
                                "
                            >
                                {timer > 0 ? (
                                    <span>
                                        ارسال مجدد کد تا{" "}
                                        <span
                                            dir="ltr"
                                            className="
                                                font-medium
                                                text-[var(--text-primary)]
                                            "
                                        >
                                            {formatTimer()}
                                        </span>
                                    </span>
                                ) : (
                                    <span>
                                        کد را دریافت نکردید؟
                                    </span>
                                )}
                            </div>

                            {/* Verify Button */}

                            <button
                                type="submit"
                                disabled={
                                    otp.join("").length !== 6
                                }
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

                                    disabled:cursor-not-allowed
                                    disabled:opacity-50

                                    active:scale-[0.99]
                                "
                            >
                                تایید کد
                            </button>
                        </form>

                        {/* =========================
                            Resend Code
                        ========================== */}

                        <div
                            className="
                                flex
                                justify-center
                                text-center
                                text-[13px]

                                sm:text-[14px]
                            "
                        >
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={timer > 0}
                                className="
                                    font-bold
                                    transition

                                    disabled:cursor-not-allowed
                                    disabled:text-[var(--text-secondary)]
                                    disabled:opacity-60

                                    enabled:text-[var(--primary)]
                                    enabled:hover:underline
                                "
                            >
                                ارسال مجدد کد
                            </button>
                        </div>

                        {/* Change Phone */}

                        <Link
                            href="/login"
                            className="
                                mx-auto
                                flex
                                items-center
                                gap-2
                                text-[13px]
                                font-medium
                                text-[var(--text-secondary)]
                                transition

                                hover:text-[var(--primary)]

                                sm:text-[14px]
                            "
                        >
                            <ArrowRight size={16} />

                            تغییر شماره موبایل
                        </Link>
                    </div>
                </div>

                {/* =========================
                    Image Section
                ========================== */}

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

                    {/* Overlay */}

                    <div
                        className="
                            absolute
                            inset-0
                            bg-[rgba(20,30,40,0.35)]
                        "
                    />

                    {/* Image Content */}

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

                        {/* =========================
                            Statistics
                        ========================== */}

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
                            {/* Experience */}

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

                            {/* Users */}

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

                            {/* Villas */}

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