"use client";

import {
    BadgeCheck,
    CheckCircle2,
    CircleAlert,
    FileText,
    Mail,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";

export default function IdentityVerification() {
    const isVerified = false;

    return (
        <section className="rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

            {/* Header */}
            <div className="flex flex-col justify-between gap-5 border-b border-gray-100 pb-6 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                    <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[12px] bg-[#f2f5f7] text-[#17334d]">
                        <ShieldCheck size={22} />
                    </div>

                    <div>
                        <h2 className="text-base font-bold text-[#17334d]">
                            تأیید هویت
                        </h2>

                        <p className="mt-2 text-xs leading-6 text-gray-400">
                            برای افزایش امنیت حساب کاربری، اطلاعات شما را
                            بررسی و تأیید می‌کنیم.
                        </p>
                    </div>
                </div>

                {/* Status */}
                <div
                    className={`flex w-fit items-center gap-2 rounded-[10px] px-4 py-2 text-xs font-medium ${
                        isVerified
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                    }`}
                >
                    {isVerified ? (
                        <BadgeCheck size={17} />
                    ) : (
                        <CircleAlert size={17} />
                    )}

                    {isVerified
                        ? "هویت شما تأیید شده است"
                        : "هویت شما هنوز تأیید نشده است"}
                </div>
            </div>

            {/* Steps */}
            <div className="mt-7">
                <h3 className="mb-5 text-sm font-bold text-[#17334d]">
                    مراحل تأیید حساب
                </h3>

                <div className="space-y-4">

                    {/* Step 1 */}
                    <div className="flex items-start gap-4 rounded-[12px] border border-gray-100 p-4">
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                            <CheckCircle2 size={20} />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h4 className="text-sm font-semibold text-[#17334d]">
                                    تأیید شماره موبایل
                                </h4>

                                <span className="rounded-md bg-green-50 px-3 py-1 text-[11px] text-green-600">
                                    تأیید شده
                                </span>
                            </div>

                            <p className="mt-2 text-xs leading-6 text-gray-400">
                                شماره موبایل شما برای ورود و اطلاع‌رسانی
                                رزروها تأیید شده است.
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs text-[#566575]">
                                <Phone size={15} />

                                <span>
                                    ۰۹۱۲ *** ****
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4 rounded-[12px] border border-gray-200 p-4">
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#f2f5f7] text-[#17334d]">
                            <Mail size={19} />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h4 className="text-sm font-semibold text-[#17334d]">
                                    تأیید ایمیل
                                </h4>

                                <span className="rounded-md bg-yellow-50 px-3 py-1 text-[11px] text-yellow-600">
                                    در انتظار تأیید
                                </span>
                            </div>

                            <p className="mt-2 text-xs leading-6 text-gray-400">
                                برای تأیید ایمیل، یک کد تأیید برای شما ارسال
                                خواهد شد.
                            </p>

                            <button
                                type="button"
                                className="mt-4 h-[40px] rounded-[8px] border border-[#17334d] px-5 text-xs font-medium text-[#17334d] transition hover:bg-[#17334d] hover:text-white"
                            >
                                ارسال کد تأیید
                            </button>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4 rounded-[12px] border border-gray-200 p-4">
                        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#f2f5f7] text-[#17334d]">
                            <UserRound size={19} />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h4 className="text-sm font-semibold text-[#17334d]">
                                    تکمیل اطلاعات هویتی
                                </h4>

                                <span className="rounded-md bg-gray-100 px-3 py-1 text-[11px] text-gray-500">
                                    انجام نشده
                                </span>
                            </div>

                            <p className="mt-2 text-xs leading-6 text-gray-400">
                                اطلاعات شخصی خود را تکمیل کنید تا حساب کاربری
                                شما اعتبار بیشتری داشته باشد.
                            </p>

                            <button
                                type="button"
                                className="mt-4 h-[40px] rounded-[8px] bg-[#17334d] px-5 text-xs font-medium text-white transition hover:bg-[#0c2438]"
                            >
                                تکمیل اطلاعات
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Info */}
            <div className="mt-7 flex gap-3 rounded-[12px] bg-[#f8f9fb] p-4">
                <ShieldCheck
                    size={20}
                    className="shrink-0 text-[#17334d]"
                />

                <div>
                    <h3 className="text-xs font-semibold text-[#17334d]">
                        امنیت اطلاعات شما
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-gray-400">
                        اطلاعات حساب شما با رعایت اصول امنیتی نگهداری می‌شود
                        و تنها برای ارائه خدمات ویلاروم مورد استفاده قرار
                        می‌گیرد.
                    </p>
                </div>
            </div>
        </section>
    );
}