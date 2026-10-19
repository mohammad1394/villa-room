"use client";

import React, {useState} from "react";
import Image from "next/image";
import {
    Home,
    Star,
    Users,
    User,
    Phone,
    Mail,
    LockKeyhole,
    Eye,
    Check,
    EyeOff,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";
import {validateEmail, validatePassword, validatePhone} from "@/utility/auth";


function Page() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData , setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone : ""
    });
    const changeHandler = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData((pre) => ({
            ...pre ,
            [e.target.name]: e.target.value,
        }))
    }

    const handleClick = async () => {

        if (!formData.fullName.trim()) {
            showCustomToast(
                "خطا",
                "لطفا نام خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!formData.email.trim()) {
            showCustomToast(
                "خطا",
                "لطفا ایمیل خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!validateEmail(formData.email)) {
            showCustomToast(
                "خطا",
                "ایمیل وارد شده معتبر نمی‌باشد",
                "x",
                "error"
            );
            return;
        }

        if (!formData.password.trim()) {
            showCustomToast(
                "خطا",
                "لطفا رمز عبور خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!validatePassword(formData.password)) {
            showCustomToast(
                "خطا",
                "رمز عبور وارد شده معتبر نمی‌باشد",
                "x",
                "error"
            );
            return;
        }

        if (!formData.phone.trim()) {
            showCustomToast(
                "خطا",
                "لطفا شماره تلفن خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!validatePhone(formData.phone)) {
            showCustomToast(
                "خطا",
                "شماره تلفن وارد شده معتبر نمی‌باشد",
                "x",
                "error"
            );
            return;
        }

        if (!formData.confirmPassword.trim()) {
            showCustomToast(
                "خطا",
                "لطفا تکرار رمز عبور خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showCustomToast(
                "خطا",
                "رمز عبور با تکرار آن برابر نیست",
                "x",
                "error"
            );
            return;
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ formData }),
        });

        if (res.status === 201) {
            showCustomToast(
                "موفق",
                "ثبت نام شما موفقیت آمیز بود",
                "check",
                "success"
            );

            router.push("/");
        }
    };
    return (
        <div
            dir="rtl"
            className="relative min-h-screen bg-[var(--surface-secondary)]"
        >
            <div
                className="m-3 grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl sm:m-5 md:m-5 md:grid-cols-[58%_42%]"
            >
                {/*Register Form */}

                <div
                    className="w-full bg-white p-5 sm:p-8 lg:p-[48px]"
                >
                    <div
                        className="mx-auto flex w-full max-w-[700px] flex-col gap-6"
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

                        {/*Title*/}

                        <div
                            className="flex flex-col items-center gap-3 sm:gap-4"
                        >
                            <h1
                                className="text-center text-[22px] font-bold text-[var(--text-primary)] sm:text-[26px]"
                            >
                                ایجاد حساب کاربری
                            </h1>

                            <p
                                className="text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]"
                            >
                                اطلاعات خود را وارد کنید و حساب بسازید
                            </p>
                        </div>

                        {/*Register Form */}

                        <form className="flex flex-col gap-5">
                            {/* Name + Phone */}

                            <div
                                className="flex flex-col gap-5 lg:flex-row lg:gap-6"
                            >
                                {/* Name */}

                                <div className="flex flex-1 flex-col">
                                    <label
                                        htmlFor="fullName"
                                        className="text-[13px] font-bold text-[var(--text-primary)]"
                                    >
                                        نام و نام خانوادگی
                                    </label>

                                    <div className="relative mt-2">
                                        <User
                                            size={18}
                                            strokeWidth={1.8}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            onChange={changeHandler}
                                            value={formData.fullName}
                                            required
                                            placeholder="نام و نام خانوادگی خود را وارد کنید"
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}

                                <div className="flex flex-1 flex-col">
                                    <label
                                        htmlFor="phone"
                                        className="text-[13px] font-bold text-[var(--text-primary)]"
                                    >
                                        شماره موبایل
                                    </label>

                                    <div className="relative mt-2">
                                        <Phone
                                            size={18}
                                            strokeWidth={1.8}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            dir="ltr"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            onChange={changeHandler}
                                            value={formData.phone}
                                            required
                                            placeholder="شماره موبایل خود را وارد کنید"
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/*Email*/}

                            <div className="flex flex-col">
                                <label
                                    htmlFor="email"
                                    className="text-[13px] font-bold text-[var(--text-primary)]"
                                >
                                    ایمیل
                                </label>

                                <div className="relative mt-2">
                                    <Mail
                                        size={18}
                                        strokeWidth={1.8}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                    />

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        dir="ltr"
                                        onChange={changeHandler}
                                        value={formData.email}
                                        autoComplete="email"
                                        required
                                        placeholder="ایمیل خود را وارد کنید"
                                        className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />
                                </div>
                            </div>

                            {/*Password*/}

                            <div
                                className="flex flex-col gap-5 lg:flex-row lg:gap-6"
                            >
                                {/* Password */}

                                <div className="flex flex-1 flex-col">
                                    <label
                                        htmlFor="password"
                                        className="text-[13px] font-bold text-[var(--text-primary)]"
                                    >
                                        رمز عبور
                                    </label>

                                    <div className="relative mt-2">
                                        <LockKeyhole
                                            size={18}
                                            strokeWidth={1.8}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
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
                                            required
                                            onChange={changeHandler}
                                            value={formData.password}
                                            placeholder="رمز عبور خود را وارد کنید"
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
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
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18}/>
                                            ) : (
                                                <Eye size={18}/>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/*Confirm Password*/}

                                <div className="flex flex-1 flex-col">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-[13px] font-bold text-[var(--text-primary)]"
                                    >
                                        تکرار رمز عبور
                                    </label>

                                    <div className="relative mt-2">
                                        <LockKeyhole
                                            size={18}
                                            strokeWidth={1.8}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
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
                                            onChange={changeHandler}
                                            value={formData.confirmPassword}
                                            required
                                            placeholder="رمز عبور خود را تکرار کنید"
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
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
                                                    ? "مخفی کردن تکرار رمز"
                                                    : "نمایش تکرار رمز"
                                            }
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18}/>
                                            ) : (
                                                <Eye size={18}/>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/*Terms*/}

                            <label
                                htmlFor="terms"
                                className="flex cursor-pointer items-start gap-2 text-[12px] leading-6 text-[var(--text-secondary)] sm:text-[13px]"
                            >
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="mt-[5px] h-[15px] w-[15px] shrink-0 accent-[var(--primary)]"
                                />

                                <span>
                                    قوانین و مقررات استفاده را مطالعه نموده‌ام
                                    و می‌پذیرم.
                                </span>
                            </label>

                            {/*Register Button*/}

                            <button
                                type="button"
                                onClick={handleClick}
                                className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99]"
                            >
                                ثبت نام
                            </button>
                        </form>

                        {/*login links */}

                        <div
                            className="flex flex-wrap justify-center gap-1 text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]"
                        >
                            <span>
                                حساب کاربری دارید؟
                            </span>

                            <Link
                                href="/login"
                                className="font-bold text-[var(--text-primary)] transition hover:underline"
                            >
                                وارد شوید
                            </Link>
                        </div>
                    </div>
                </div>

                {/*image section */}
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
            </div>
        </div>
    );
}

export default Page;