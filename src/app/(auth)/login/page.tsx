"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    Phone,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { showCustomToast } from "@/components/modules/layout/toast/toast";
import RegisterImageSection from "@/components/templates/Register/loginImageSection";

import {
    LoginValidator,
    OtpLoginValidator,
    type LoginFormValues,
    type OtpLoginFormValues,
} from "@/validator/loginValidator";

function Page() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isOtpLogin, setIsOtpLogin] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues | OtpLoginFormValues>({
        resolver: zodResolver(
            isOtpLogin ? OtpLoginValidator : LoginValidator
        ),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            phoneNumber: "",
        },
    });

    const changeLoginMode = (otpMode: boolean) => {
        setIsOtpLogin(otpMode);
        setShowPassword(false);
        reset();
    };

    const formSubmitting = async (
        data: LoginFormValues | OtpLoginFormValues
    ) => {
        if (isOtpLogin) {
            const otpData = data as OtpLoginFormValues;


            router.push("verify-otp")

            return;
        }

        const loginData = data as LoginFormValues;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                showCustomToast(
                    "خطا",
                    result.message || "ورود به حساب کاربری انجام نشد",
                    "x",
                    "error"
                );

                return;
            }

            showCustomToast(
                "موفق",
                "شما با موفقیت وارد شدید",
                "check",
                "success"
            );

            router.refresh();
            router.push("/");
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
            <div className="m-3 grid min-h-[650px] grid-cols-1 overflow-hidden rounded-xl sm:m-5 md:m-8 md:grid-cols-[58%_42%] lg:m-8">

                {/* Form Section */}
                <div className="w-full bg-white p-5 sm:p-8 lg:p-[48px]">
                    <div className="mx-auto flex w-full max-w-[460px] flex-col gap-6">

                        {/* Logo */}
                        <div className="text-center">
                            <Link
                                href="/"
                                className="text-[22px] font-bold text-[var(--primary)] sm:text-[24px]"
                            >
                                ویلا روم
                            </Link>
                        </div>

                        {/* Form Title */}
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <h1 className="text-center text-[22px] font-bold text-[var(--text-primary)] sm:text-[26px]">
                                ورود به حساب کاربری
                            </h1>

                            <p className="text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]">
                                برای ادامه وارد حساب کاربری خود شوید
                            </p>
                        </div>

                        {/* Login Form */}
                        <form
                            className="flex flex-col gap-5"
                            onSubmit={handleSubmit(formSubmitting)}
                            noValidate
                        >

                            {/* Email / Phone */}
                            <div className="flex w-full flex-col">
                                <label
                                    htmlFor={isOtpLogin ? "phoneNumber" : "email"}
                                    className="text-[13px] font-bold text-[var(--text-primary)]"
                                >
                                    {isOtpLogin ? "شماره موبایل" : "ایمیل"}
                                </label>

                                <div className="relative mt-2">
                                    {isOtpLogin ? (
                                        <Phone
                                            size={18}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    ) : (
                                        <Mail
                                            size={18}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--text-secondary)]"
                                        />
                                    )}

                                    {isOtpLogin ? (
                                        <input
                                            id="phoneNumber"
                                            type="tel"
                                            autoComplete="tel"
                                            placeholder="شماره موبایل خود را وارد کنید"
                                            {...register("phoneNumber")}
                                            aria-invalid={!!errors.phoneNumber}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />
                                    ) : (
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="ایمیل خود را وارد کنید"
                                            {...register("email")}
                                            aria-invalid={!!errors.email}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[14px] pr-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />
                                    )}
                                </div>

                                {isOtpLogin && errors.phoneNumber && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.phoneNumber.message}
                                    </p>
                                )}

                                {!isOtpLogin && errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
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
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            placeholder="رمز عبور خود را وارد کنید"
                                            {...register("password")}
                                            aria-invalid={!!errors.password}
                                            className="h-[48px] w-full rounded-[9px] border border-[var(--border)] bg-white px-[42px] text-[13px] text-[var(--text-primary)] transition outline-none placeholder:text-[var(--text-secondary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "مخفی کردن رمز عبور"
                                                    : "نمایش رمز عبور"
                                            }
                                            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--text-secondary)] transition hover:text-[var(--primary)]"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Remember / Forgot Password */}
                            {!isOtpLogin && (
                                <div className="flex w-full items-center justify-between gap-3 text-[12px] sm:text-[13px]">
                                    <label
                                        htmlFor="remember"
                                        className="flex cursor-pointer items-center gap-2 text-[var(--text-secondary)]"
                                    >
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            className="h-[15px] w-[15px] shrink-0 accent-[var(--primary)]"
                                        />

                                        <span>مرا به خاطر بسپار</span>
                                    </label>

                                    <Link
                                        href="/forgot-password"
                                        className="font-medium whitespace-nowrap text-[var(--text-primary)] transition hover:underline"
                                    >
                                        فراموشی رمز عبور؟
                                    </Link>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-[48px] w-full rounded-[9px] bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubmitting
                                    ? "لطفاً صبر کنید..."
                                    : isOtpLogin
                                        ? "دریافت کد تأیید"
                                        : "ورود به حساب"}
                            </button>
                        </form>

                        {/* Register / Change Login Method */}
                        <div className="flex flex-wrap justify-center gap-2 text-center text-[13px] text-[var(--text-secondary)] sm:text-[14px]">
                            <span>حساب کاربری ندارید؟</span>

                            <Link
                                href="/register"
                                className="font-bold text-[var(--text-primary)] hover:underline"
                            >
                                ثبت نام کنید
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={() => changeLoginMode(!isOtpLogin)}
                            className="h-[48px] w-full rounded-[9px] border border-[var(--primary)] text-[14px] font-bold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                        >
                            {isOtpLogin
                                ? "ورود با رمز عبور"
                                : "ورود با کد یکبار مصرف"}
                        </button>
                    </div>
                </div>

                {/* Image Section */}
                <RegisterImageSection />
            </div>
        </div>
    );
}

export default Page;
