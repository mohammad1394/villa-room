"use client";

import { Send } from "lucide-react";
import React, { useState } from "react";
import { showCustomToast } from "@/components/modules/layout/toast/toast";
import { validateEmail, validatePhone } from "@/utility/auth";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const changeHandler = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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

        if (!validateEmail(formData.email.trim())) {
            showCustomToast(
                "خطا",
                "ایمیل وارد شده معتبر نمی‌باشد",
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

        if (!validatePhone(formData.phone.trim())) {
            showCustomToast(
                "خطا",
                "شماره تلفن وارد شده معتبر نمی‌باشد",
                "x",
                "error"
            );
            return;
        }

        if (!formData.subject) {
            showCustomToast(
                "خطا",
                "موضوع پیام خود را انتخاب کنید",
                "x",
                "error"
            );
            return;
        }

        if (formData.message.trim().length < 10) {
            showCustomToast(
                "خطا",
                "طول پیام شما حداقل باید 10 کاراکتر باشد",
                "x",
                "error"
            );
            return;
        }

        try {
            setIsLoading(true);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: formData.fullName.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    subject: formData.subject,
                    message: formData.message.trim(),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                showCustomToast(
                    "خطا",
                    data.message || "خطایی رخ داد",
                    "x",
                    "error"
                );

                return;
            }

            showCustomToast(
                "موفق",
                "پیام شما با موفقیت ثبت شد",
                "check",
                "success"
            );

            // پاک کردن فرم
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            });

        } catch (error) {
            console.error("CONTACT_FORM_ERROR:", error);

            showCustomToast(
                "خطا",
                "خطا در ارتباط با سرور",
                "x",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    console.log(process.env.NEXT_PUBLIC_MONGODB_URL)
    return (
        <div className="rounded-[10px] border border-gray-200 bg-white p-4 sm:p-5 md:p-6">

            <div>
                <h2 className="text-[20px] font-bold text-[var(--text-primary)] sm:text-[17px]">
                    پیام خود را برای ما ارسال کنید
                </h2>

                <p className="mt-2 text-[10px] text-[var(--text-secondary)] sm:text-[11px]">
                    فرم زیر را تکمیل کنید تا کارشناسان ما با شما تماس بگیرند.
                </p>
            </div>

            <form
                className="mt-5 space-y-4"
                onSubmit={submitHandler}
            >

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium">
                            نام و نام خانوادگی
                            <span className="mr-1 text-red-500">*</span>
                        </label>

                        <input
                            type="text"
                            placeholder="نام خود را وارد کنید"
                            name="fullName"
                            value={formData.fullName}
                            onChange={changeHandler}
                            className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium">
                            شماره تماس
                            <span className="mr-1 text-red-500">*</span>
                        </label>

                        <input
                            type="tel"
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            name="phone"
                            value={formData.phone}
                            onChange={changeHandler}
                            className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium">
                        ایمیل
                    </label>

                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium">
                        موضوع
                        <span className="mr-1 text-red-500">*</span>
                    </label>

                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={changeHandler}
                        className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="">موضوع پیام را انتخاب کنید</option>
                        <option value="reservation">رزرو ویلا</option>
                        <option value="payment">پرداخت</option>
                        <option value="support">پشتیبانی</option>
                        <option value="complaint">انتقاد و پیشنهاد</option>
                        <option value="other">سایر</option>
                    </select>
                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium">
                        پیام شما
                        <span className="mr-1 text-red-500">*</span>
                    </label>

                    <textarea
                        rows={4}
                        placeholder="پیام خود را بنویسید..."
                        name="message"
                        value={formData.message}
                        onChange={changeHandler}
                        className="min-h-[90px] w-full resize-none rounded-[7px] border border-gray-200 bg-white px-3 py-2.5 text-[10px] outline-none focus:border-[var(--primary)]"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[7px] bg-[var(--primary)] text-[11px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <Send size={14} />

                    {isLoading
                        ? "در حال ارسال..."
                        : "ارسال پیام"}
                </button>

            </form>
        </div>
    );
}