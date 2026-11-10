"use client";

import {useState} from "react";
import Link from "next/link";
import {
    User,
    Phone,
    Mail,
    LockKeyhole,
    Eye,
    EyeOff,
} from "lucide-react";
import {useForm} from "react-hook-form";

import {
    RegisterValidator,
    type RegisterFormValues,
} from "@/validator/RegisterValidator";

import RegisterImageSection from "@/components/templates/Register/loginImageSection";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {router} from "next/client";

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(RegisterValidator),
        mode: "onTouched",
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            password: "",
            repeatPassword: "",
            terms: false,
        },
    });

    const formSubmitting = async (data: RegisterFormValues) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.status === 201) {
                showCustomToast(
                    "موفق",
                    "ثبت‌نام شما با موفقیت انجام شد",
                    "check",
                    "success"
                );
                router.push("/");
            } else {
                showCustomToast(
                    "خطا",
                    result.message || "ثبت‌نام انجام نشد",
                    "x",
                    "error"
                );
            }
        } catch {
            showCustomToast(
                "خطا",
                "ارتباط با سرور برقرار نشد",
                "x",
                "error"
            );
        }
    };

    return (
        <div
            dir="rtl"
            className="relative min-h-screen bg-[var(--surface-secondary)]"
        >
            <div
                className="m-3 grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl sm:m-5 md:m-5 md:grid-cols-[58%_42%]">

                {/* Register Form */}

                <div className="w-full bg-white p-5 sm:p-8 lg:p-[48px]">
                    <div className="mx-auto flex w-full max-w-[700px] flex-col gap-6">

                        {/* Logo */}

                        <div className="text-center">
                            <Link
                                href="/"
                                className="text-[22px] font-bold text-[var(--primary)] sm:text-[24px]"
                            >
                                ویلا روم
                            </Link>
                        </div>

                        {/* Title */}

                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <h1 className="text-center text-[22px] font-bold text-[var(--text-primary)] sm:text-[26px]">
                                ایجاد حساب کاربری
                            </h1>

                            <p className="text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]">
                                اطلاعات خود را وارد کنید و حساب بسازید
                            </p>
                        </div>

                        {/* Form */}

                        <form
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit(formSubmitting)}
                            noValidate
                        >

                            {/* Name + Phone */}

                            <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">

                                {/* Full Name */}

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
                                            type="text"
                                            autoComplete="name"
                                            {...register("fullName")}
                                            placeholder="نام و نام خانوادگی خود را وارد کنید"
                                            aria-invalid={!!errors.fullName}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />
                                    </div>

                                    {errors.fullName && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}

                                <div className="flex flex-1 flex-col">
                                    <label
                                        htmlFor="phoneNumber"
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
                                            id="phoneNumber"
                                            type="tel"
                                            dir="ltr"
                                            inputMode="numeric"
                                            autoComplete="tel"
                                            {...register("phoneNumber")}
                                            placeholder="شماره موبایل خود را وارد کنید"
                                            aria-invalid={!!errors.phoneNumber}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />
                                    </div>

                                    {errors.phoneNumber && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}

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
                                        type="email"
                                        dir="ltr"
                                        autoComplete="email"
                                        {...register("email")}
                                        placeholder="ایمیل خود را وارد کنید"
                                        aria-invalid={!!errors.email}
                                        className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password + Repeat Password */}

                            <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">

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
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            {...register("password")}
                                            placeholder="رمز عبور خود را وارد کنید"
                                            aria-invalid={!!errors.password}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
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

                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Repeat Password */}

                                <div className="flex flex-1 flex-col">
                                    <label
                                        htmlFor="repeatPassword"
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
                                            id="repeatPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            {...register("repeatPassword")}
                                            placeholder="رمز عبور خود را تکرار کنید"
                                            aria-invalid={!!errors.repeatPassword}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword((prev) => !prev)
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

                                    {errors.repeatPassword && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.repeatPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Terms */}

                            <div>
                                <label
                                    htmlFor="terms"
                                    className="flex cursor-pointer items-start gap-2 text-[12px] leading-6 text-[var(--text-secondary)] sm:text-[13px]"
                                >
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        {...register("terms")}
                                        className="mt-[5px] h-[15px] w-[15px] shrink-0 accent-[var(--primary)]"
                                    />

                                    <span>
                    قوانین و مقررات استفاده را مطالعه نموده‌ام
                    و می‌پذیرم.
                  </span>
                                </label>

                                {errors.terms && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.terms.message}
                                    </p>
                                )}
                            </div>

                            {/* Register Button */}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting ? "در حال ثبت نام..." : "ثبت نام"}
                            </button>
                        </form>

                        {/* Login Link */}

                        <div
                            className="flex flex-wrap justify-center gap-1 text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]">
                            <span>حساب کاربری دارید؟</span>

                            <Link
                                href="/login"
                                className="font-bold text-[var(--text-primary)] transition hover:underline"
                            >
                                وارد شوید
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Image Section */}

                <RegisterImageSection/>
            </div>
        </div>
    );
}

export default RegisterForm;
