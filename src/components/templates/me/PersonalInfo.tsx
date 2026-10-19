"use client"
import React, {useEffect, useState} from 'react';
import {UserType} from "@/types/User";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {validateEmail} from "@/utility/auth";
import {useRouter} from "next/navigation";


function PersonalInfo() {
    const router = useRouter();
    const [marketingNotifications, setMarketingNotifications] = useState(true);
    const [bookingNotifications, setBookingNotifications] = useState(true);


    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const getPersonalInfo = async () => {
            const res = await fetch("/api/auth/me");

            const data = await res.json();

            setEmail(data.email);
            setFullName(data.fullName);
            setPhone(data.phone);

        }
        getPersonalInfo();
    }, []);
    const updateInfo = async () => {
        if (!fullName.trim()) {
            showCustomToast(
                "خطا",
                "لطفا نام خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!email.trim()) {
            showCustomToast(
                "خطا",
                "لطفا ایمیل خود را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        if (!validateEmail(email)) {
            showCustomToast(
                "خطا",
                "ایمیل وارد شده معتبر نمی‌باشد",
                "x",
                "error"
            );
            return;
        }

        const updatedInfo = {
            fullName,
            email
        }
        const res = await fetch("/api/auth/me", {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(updatedInfo)
        })

        if (res.ok) {
            showCustomToast(
                "موفق",
                "اطلاعات شما با موفقیت بروزرسانی شد",
                "check",
                "success"
            );

            const res = await fetch("/api/auth/logout", {
                method: "DELETE",
            })
            if (res.ok) {
                router.push("/login");
            }
        }


    }


    return (
        <>
            <section className="w-full rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="mb-7 text-base font-bold text-[#17334d]">
                    اطلاعات شخصی
                </h2>

                <div className="grid grid-cols-1 gap-x-5 gap-y-5">

                    <div>
                        <label className="mb-2 block text-xs text-[#566575]">
                            نام و نام خانوادگی
                        </label>

                        <input
                            defaultValue={fullName}
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value)
                            }}
                            className="h-[48px] w-1/2 rounded-[10px] border border-gray-200 bg-white px-4 text-sm text-[#17334d] transition outline-none focus:border-[#d9a13b]"
                        />
                    </div>


                    <div>
                        <label className="mb-2 block text-xs text-[#566575]">
                            ایمیل
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            className="h-[48px] w-1/2 rounded-[10px] border border-gray-200 bg-white px-4 text-left text-sm text-[#17334d] transition outline-none focus:border-[#d9a13b]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs text-[#566575]">
                            برای تغییر شماره موبایل به پشتیبانی تیکت بزنید
                        </label>

                        <input
                            type={"tel"}
                            disabled
                            value={phone}
                            className="h-[48px] w-1/2 rounded-[10px] border border-gray-200 bg-white px-4 text-sm text-[#17334d] transition outline-none focus:border-[#d9a13b]"
                        />
                    </div>
                </div>


                <button
                    onClick={updateInfo}
                    className="mt-7 flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#17334d] px-8 text-sm font-medium text-white transition hover:bg-[#0c2438] sm:w-[200px]"
                >
                    ذخیره تغییرات
                </button>
            </section>

            {/* Notification Settings */
            }
            <section className="mt-6 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                    <h2 className="text-base font-bold text-[#17334d]">
                        تنظیمات ارتباطی
                    </h2>
                </div>

                {/* Marketing */}
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
                            setMarketingNotifications(
                                !marketingNotifications
                            )
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

                {/* Booking */}
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
                            setBookingNotifications(
                                !bookingNotifications
                            )
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
    )
        ;
}

export default PersonalInfo;