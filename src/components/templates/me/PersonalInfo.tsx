
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/axios";
import { showCustomToast } from "@/components/modules/layout/toast/toast";
import {UpadatedProfileFormValues, updateProfileSchema} from "@/validator/userValidator";

function PersonalInfo() {
    const [marketingNotifications, setMarketingNotifications] =
        useState(true);

    const [bookingNotifications, setBookingNotifications] =
        useState(true);

    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<UpadatedProfileFormValues>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
        mode: "onBlur",
    });

    useEffect(() => {
        const getPersonalInfo = async () => {
            try {
                const response = await api.get("/api/auth/me");

                const data = response.data;

                reset({
                    fullName: data.fullName ?? "",
                    email: data.email ?? "",
                });

                setPhone(data.phone ?? "");
            } catch (error) {
                showCustomToast(
                    "خطا",
                    "دریافت اطلاعات کاربر با مشکل مواجه شد",
                    "x",
                    "error"
                );
            } finally {
                setIsLoading(false);
            }
        };

        getPersonalInfo();
    }, [reset]);

    const updateInfo = async (data: UpadatedProfileFormValues) => {
        try {
            await api.patch("/api/auth/me", data);

            showCustomToast(
                "موفق",
                "اطلاعات شما با موفقیت بروزرسانی شد",
                "check",
                "success"
            );

            reset(data);
        } catch (error) {
            showCustomToast(
                "خطا",
                "در بروزرسانی اطلاعات مشکلی رخ داد",
                "x",
                "error"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[250px] items-center justify-center">
                <p className="text-sm text-gray-500">
                    در حال دریافت اطلاعات...
                </p>
            </div>
        );
    }

    return (
        <>
            <section className="w-full rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="mb-7 text-base font-bold text-[#17334d]">
                    اطلاعات شخصی
                </h2>

                <form
                    onSubmit={handleSubmit(updateInfo)}
                    noValidate
                >
                    <div className="grid grid-cols-1 gap-x-5 gap-y-5">
                        <div>
                            <label className="mb-2 block text-xs text-[#566575]">
                                نام و نام خانوادگی
                            </label>

                            <input
                                {...register("fullName")}
                                className="h-[48px] w-1/2 rounded-[10px] border border-gray-200 bg-white px-4 text-sm text-[#17334d] transition outline-none focus:border-[#d9a13b]"
                            />

                            {errors.fullName && (
                                <p className="mt-2 text-xs text-red-500">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs text-[#566575]">
                                ایمیل
                            </label>

                            <input
                                type="email"
                                {...register("email")}
                                className="h-[48px] w-1/2 rounded-[10px] border border-gray-200 bg-white px-4 text-left text-sm text-[#17334d] transition outline-none focus:border-[#d9a13b]"
                            />

                            {errors.email && (
                                <p className="mt-2 text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs text-[#566575]">
                                برای تغییر شماره موبایل به پشتیبانی تیکت بزنید
                            </label>

                            <input
                                type="tel"
                                disabled
                                value={phone}
                                className="h-[48px] w-1/2 rounded-[10px] border border-gray-200 bg-white px-4 text-sm text-[#17334d] transition outline-none disabled:bg-gray-50"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-7 flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#17334d] px-8 text-sm font-medium text-white transition hover:bg-[#0c2438] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[200px]"
                    >
                        {isSubmitting
                            ? "در حال ذخیره..."
                            : "ذخیره تغییرات"}
                    </button>
                </form>
            </section>

            <section className="mt-6 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                    <h2 className="text-base font-bold text-[#17334d]">
                        تنظیمات ارتباطی
                    </h2>
                </div>

                <div className="flex items-center justify-between gap-5 px-5 py-5 sm:px-7">
                    <div>
                        <h3 className="text-sm font-semibold text-[#17334d]">
                            دریافت پیام‌های تبلیغاتی
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-gray-400">
                            از جدیدترین تخفیف‌ها و پیشنهادهای ویژه ویلاروم
                            مطلع شوید.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setMarketingNotifications((prev) => !prev)
                        }
                        className={`relative h-[28px] w-[50px] shrink-0 rounded-full transition ${
                            marketingNotifications
                                ? "bg-[#17334d]"
                                : "bg-gray-200"
                        }`}
                    >
                        <span
                            className={`absolute top-[4px] h-[20px] w-[20px] rounded-full bg-white shadow-sm transition ${
                                marketingNotifications
                                    ? "right-[26px]"
                                    : "right-[4px]"
                            }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between gap-5 border-t border-gray-100 px-5 py-5 sm:px-7">
                    <div>
                        <h3 className="text-sm font-semibold text-[#17334d]">
                            دریافت پیامک‌های اطلاع‌رسانی
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-gray-400">
                            وضعیت رزروها و پیام‌های مهم را از طریق پیامک
                            دریافت کنید.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setBookingNotifications((prev) => !prev)
                        }
                        className={`relative h-[28px] w-[50px] shrink-0 rounded-full transition ${
                            bookingNotifications
                                ? "bg-[#17334d]"
                                : "bg-gray-200"
                        }`}
                    >
                        <span
                            className={`absolute top-[4px] h-[20px] w-[20px] rounded-full bg-white shadow-sm transition ${
                                bookingNotifications
                                    ? "right-[26px]"
                                    : "right-[4px]"
                            }`}
                        />
                    </button>
                </div>
            </section>
        </>
    );
}

export default PersonalInfo;
