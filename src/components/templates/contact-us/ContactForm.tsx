"use client";

import { Send } from "lucide-react";
import { showCustomToast } from "@/components/modules/layout/toast/toast";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {contactUsSchema, ContactUsValues} from "@/validator/contactUsValidator";

export default function ContactForm() {

    const {register , handleSubmit , formState : {errors , isSubmitting} , reset } = useForm<ContactUsValues>({
        resolver : zodResolver(contactUsSchema),
        defaultValues : {
            fullName: "" ,
            email:  "",
            message: "",
            phone: "",
            subject: "support"
        },
        mode : "onTouched"
    });

    const submitHandler = async (data : ContactUsValues ) => {

        try {

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                showCustomToast(
                    "خطا",
                    result.message || "خطایی رخ داد",
                    "x",
                    "error"
                );

                return;
            }

            reset();
            showCustomToast(
                "موفق",
                "پیام شما با موفقیت ثبت شد",
                "check",
                "success"
            );



        } catch (error) {

            showCustomToast(
                "خطا",
                "خطا در ارتباط با سرور",
                "x",
                "error"
            );
        }
    };

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
                onSubmit={handleSubmit(submitHandler)}
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
                            {...register("fullName")}
                            className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                        />

                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-[12px] font-medium">
                            شماره تماس
                            <span className="mr-1 text-red-500">*</span>
                        </label>

                        <input
                            type="tel"
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            {...register("phone")}
                            className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                        />

                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium">
                        ایمیل
                    </label>

                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        {...register("email")}
                        className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                    />

                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium">
                        موضوع
                        <span className="mr-1 text-red-500">*</span>
                    </label>

                    <select
                        {...register("subject")}
                        className="h-[40px] w-full rounded-[7px] border border-gray-200 bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                    >
                        <option value="">موضوع پیام را انتخاب کنید</option>
                        <option value="reservation">رزرو ویلا</option>
                        <option value="my-payment">پرداخت</option>
                        <option value="support">پشتیبانی</option>
                        <option value="complaint">انتقاد و پیشنهاد</option>
                        <option value="other">سایر</option>
                    </select>

                    {errors.subject && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.subject.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-[12px] font-medium">
                        پیام شما
                        <span className="mr-1 text-red-500">*</span>
                    </label>

                    <textarea
                        rows={4}
                        placeholder="پیام خود را بنویسید..."
                        {...register("message")}
                        className="min-h-[90px] w-full resize-none rounded-[7px] border border-gray-200 bg-white px-3 py-2.5 text-[10px] outline-none focus:border-[var(--primary)]"
                    />

                    {errors.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.message.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[7px] bg-[var(--primary)] text-[11px] font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <Send size={14} />

                    {isSubmitting
                        ? "در حال ارسال..."
                        : "ارسال پیام"}
                </button>

            </form>
        </div>
    );
}