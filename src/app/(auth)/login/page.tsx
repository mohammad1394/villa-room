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
    Lock, Phone,
} from "lucide-react";
import Link from "next/link";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";
import {validateEmail} from "@/utility/auth";

function Page() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpLogin, setIsOtpLogin] = useState<boolean>(false);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isOtpLogin) {
            return;
        }


        const cleanIdentifier = identifier.trim().toLowerCase();

        if (!cleanIdentifier.trim()) {
            showCustomToast(
                "خطا",
                "لطفا ایمیل خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }
        if (!validateEmail(cleanIdentifier)) {
            showCustomToast(
                "خطا",
                "ایمیل وارد شده معتبر نمی‌باشد",
                "x",
                "error"
            );
            return;
        }
        if (!password.trim()) {
            showCustomToast(
                "خطا",
                "لطفا رمز عبور خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: cleanIdentifier,
                password,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            showCustomToast(
                "خطا",
                `${data.message}`,
                "x",
                "error"
            );


            return;
        }

        if (res.ok) {
            showCustomToast(
                "موفق",
                "شما با موفقیت وارد شدید",
                "check",
                "success"
            );
            router.refresh();
            router.push("/");
        }


    };


    return (
        <div
            dir="rtl"
            className="relative min-h-screen bg-[var(--surface-secondary)]"
        >
            <div
                className="m-3 grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl sm:m-5 md:m-8 md:grid-cols-[58%_42%] lg:m-8"
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
                                ورود به حساب کاربری
                            </h1>

                            <p
                                className="text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]"
                            >
                                برای ادامه وارد حساب کاربری خود شوید
                            </p>
                        </div>


                        {/*login form */}
                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                            {/* Email / Phone */}
                            <div className="flex w-full flex-col">

                                <label
                                    htmlFor="email"
                                    className="text-[13px] font-bold text-[var(--text-primary)]"
                                >
                                    {
                                        !isOtpLogin ? "ایمیل" : "شماره تلفن"
                                    }
                                </label>

                                <div className="relative mt-2">

                                    {!isOtpLogin ? (
                                            <Mail
                                                size={18}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                            />
                                        )
                                        : (
                                            <Phone
                                                size={18}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                            />
                                        )}

                                    <input
                                        id="email"
                                        type="text"
                                        placeholder={!isOtpLogin ? " ایمیل خود را وارد  کنید" : "شماره تلفن خود را وارد کنید"}
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />

                                </div>

                            </div>


                            {/* Password */}
                            {!isOtpLogin && (
                                <div className="flex w-full flex-col">

                                    <label
                                        htmlFor="password"
                                        className="text-[13px] font-bold text-[var(--text-primary)]"
                                    >
                                        رمز عبور
                                    </label>

                                    <div className="relative mt-2">

                                        <Lock
                                            size={18}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="رمز عبور خود را وارد کنید"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
                                            aria-label={
                                                showPassword
                                                    ? "مخفی کردن رمز عبور"
                                                    : "نمایش رمز عبور"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18}/>
                                            ) : (
                                                <Eye size={18}/>
                                            )}
                                        </button>

                                    </div>

                                </div>
                            )}


                            {/* Remember / Forgot Password */}
                            {
                                !isOtpLogin && (
                                    <div
                                        className="flex w-full items-center justify-between gap-3 text-[12px] sm:text-[13px]"
                                    >

                                        <label
                                            htmlFor="remember"
                                            className="flex cursor-pointer items-center gap-2 text-[var(--text-secondary)]"
                                        >
                                            <input
                                                id="remember"
                                                type="checkbox"
                                                className="h-[15px] w-[15px] shrink-0 accent-[var(--primary)]"
                                            />

                                            <span>
                                        مرا به خاطر بسپار
                                    </span>
                                        </label>


                                        <Link
                                            href="/forgot-password"
                                            className="font-medium whitespace-nowrap text-[var(--text-primary)] transition hover:underline"
                                        >
                                            فراموشی رمز عبور؟
                                        </Link>

                                    </div>
                                )
                            }


                            {/* Login Button */}
                            <button
                                type="submit"
                                className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                            >
                                ورود به حساب
                            </button>

                        </form>


                        {/* Register */}
                        <div
                            className="flex flex-wrap justify-center gap-1 text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]"
                        >

                            <span>
                                حساب کاربری ندارید؟
                            </span>

                            <Link
                                href="/register"
                                className="font-bold text-[var(--text-primary)] hover:underline"
                            >
                                ثبت نام کنید
                            </Link>
                            {isOtpLogin ? (
                                <button
                                    type="button"
                                    className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                                    onClick={() => setIsOtpLogin(false)}
                                >
                                    ورود با رمز عبور
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                                    onClick={() => setIsOtpLogin(true)}
                                >
                                    ورود با کد یکبار مصرف
                                </button>
                            )}
                        </div>

                    </div>
                </div>


                {/* =========================
                    Image Section
                ========================== */}
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