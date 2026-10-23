"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    CalendarDays,
    CreditCard,
    FileText,
    CircleHelp,
    Headset,
    UserRound,
    ChevronDown,
    MessageCircle,
    ShieldCheck,
    Clock,
    ArrowLeft,
    MapPin,
    X,
} from "lucide-react";

const categories = [
    { id: "account", title: "ثبت نام و ورود", icon: UserRound },
    { id: "booking", title: "رزرو و پرداخت", icon: CreditCard },
    { id: "rules", title: "قوانین و مقررات", icon: FileText },
    { id: "general", title: "پرسش‌های عمومی", icon: CircleHelp },
    { id: "support", title: "تماس با پشتیبانی", icon: Headset },
];

const faqs = [
    {
        category: "booking",
        question: "چگونه می‌توانم یک ویلا رزرو کنم؟",
        answer:
            "ابتدا از صفحه ویلاها، مقصد و تاریخ سفر خود را انتخاب کنید. سپس جزئیات ویلا، امکانات، ظرفیت و قیمت را بررسی کنید. پس از انتخاب تاریخ و تعداد نفرات، مراحل ثبت رزرو و پرداخت را تکمیل کنید.",
    },
    {
        category: "booking",
        question: "هزینه رزرو ویلا چگونه محاسبه می‌شود؟",
        answer:
            "هزینه اقامت بر اساس قیمت هر شب، تعداد شب‌های اقامت و تخفیف‌های احتمالی محاسبه می‌شود. مبلغ نهایی را پیش از پرداخت بررسی کنید.",
    },
    {
        category: "booking",
        question: "آیا امکان لغو کردن رزرو وجود دارد؟",
        answer:
            "شرایط لغو به قوانین اقامتگاه و زمان باقی‌مانده تا شروع سفر بستگی دارد. پیش از ثبت رزرو، قوانین لغو همان ویلا را مطالعه کنید.",
    },
    {
        category: "booking",
        question: "چطور از وضعیت رزرو خود مطلع شوم؟",
        answer:
            "وارد حساب کاربری خود شوید و بخش رزروهای من را بررسی کنید. وضعیت رزرو و جزئیات آن در همان بخش نمایش داده می‌شود.",
    },
    {
        category: "account",
        question: "چگونه در ویلا روم ثبت نام کنم؟",
        answer:
            "از گزینه ورود / ثبت نام استفاده کنید و مراحل احراز هویت نمایش داده‌شده در سایت را تکمیل کنید.",
    },
    {
        category: "account",
        question: "اگر رمز عبور یا اطلاعات ورودم را فراموش کنم چه کنم؟",
        answer:
            "از روش بازیابی حساب که در صفحه ورود ارائه شده است استفاده کنید. اگر همچنان مشکل داشتید، با پشتیبانی تماس بگیرید.",
    },
    {
        category: "rules",
        question: "ساعت ورود و خروج ویلاها چگونه است؟",
        answer:
            "ساعت تحویل و تخلیه ممکن است در هر اقامتگاه متفاوت باشد. اطلاعات ثبت‌شده در صفحه ویلا و جزئیات رزرو خود را بررسی کنید.",
    },
    {
        category: "rules",
        question: "آیا می‌توان تعداد نفرات را تغییر داد؟",
        answer:
            "ظرفیت مجاز هر ویلا در صفحه آن مشخص شده است. پیش از رزرو یا تغییر برنامه سفر، ظرفیت اقامتگاه را بررسی کنید و برای هماهنگی با پشتیبانی تماس بگیرید.",
    },
    {
        category: "general",
        question: "چطور ویلای مناسب سفرم را پیدا کنم؟",
        answer:
            "از جست‌وجوی مقصد و فیلترهای نوع اقامتگاه، محدوده قیمت و امکانات استفاده کنید تا گزینه‌های متناسب با نیازتان را پیدا کنید.",
    },
    {
        category: "general",
        question: "اگر پس از پرداخت مشکلی پیش بیاید چه کنم؟",
        answer:
            "اطلاعات پرداخت و رزرو خود را نگه دارید و با پشتیبانی تماس بگیرید تا وضعیت تراکنش بررسی شود.",
    },
];

export default function GuidePage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const query = search.trim().toLowerCase();

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory =
            activeCategory === "all" || faq.category === activeCategory;

        const matchesSearch =
            !query ||
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    const currentCategory = categories.find(
        (category) => category.id === activeCategory,
    );

    return (
        <main dir="rtl" className="min-h-screen bg-gray-50 text-gray-800">
            <section className="relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-900/75 to-slate-800/35" />

                <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-orange-200">
              <MapPin size={14} />
              همراه شما در تمام مراحل سفر
            </span>

                        <h1 className="mt-5 text-3xl font-extrabold leading-relaxed text-white sm:text-4xl">
                            راهنمای ویلا روم
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                            پاسخ سوالاتت رو پیدا کن و با خیال راحت برای سفر بعدی‌ات برنامه‌ریزی کن.
                        </p>

                        <div className="mt-7 flex h-12 max-w-xl items-center gap-3 rounded-2xl bg-white px-4 shadow-xl sm:h-14">
                            <Search className="shrink-0 text-gray-400" size={20} />

                            <input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setOpenFaq(null);
                                }}
                                placeholder="سوالت رو جستجو کن..."
                                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setOpenFaq(0);
                                    }}
                                    aria-label="پاک کردن جستجو"
                                    className="text-gray-400 hover:text-gray-700"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
                    <div className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {activeCategory === "all"
                                        ? "سوالات متداول"
                                        : currentCategory?.title}
                                </h2>
                                <p className="mt-1 text-xs leading-6 text-gray-500 sm:text-sm">
                                    پاسخ سوالات پرتکرار کاربران ویلا روم
                                </p>
                            </div>

                            <span className="shrink-0 rounded-lg bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-[var(--primary)]">
                {filteredFaqs.length} سوال
              </span>
                        </div>

                        <div className="mt-5 space-y-2.5">
                            {filteredFaqs.map((faq) => {
                                const originalIndex = faqs.indexOf(faq);
                                const isOpen = openFaq === originalIndex;

                                return (
                                    <div
                                        key={faq.question}
                                        className={`overflow-hidden rounded-xl border transition ${
                                            isOpen
                                                ? "border-orange-200 bg-orange-50/30"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenFaq(isOpen ? null : originalIndex)
                                            }
                                            aria-expanded={isOpen}
                                            className="flex w-full items-center justify-between gap-4 px-4 py-4 text-right"
                                        >
                      <span className="text-sm font-semibold leading-6 text-gray-800">
                        {faq.question}
                      </span>

                                            <ChevronDown
                                                size={18}
                                                className={`shrink-0 text-gray-400 transition-transform ${
                                                    isOpen ? "rotate-180 text-[var(--primary)]" : ""
                                                }`}
                                            />
                                        </button>

                                        {isOpen && (
                                            <div className="px-4 pb-4">
                                                <div className="border-t border-gray-100 pt-3 text-sm leading-7 text-gray-600">
                                                    {faq.answer}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {filteredFaqs.length === 0 && (
                                <div className="flex flex-col items-center py-12 text-center">
                                    <Search size={30} className="text-gray-300" />
                                    <p className="mt-3 text-sm font-semibold text-gray-700">
                                        سوالی پیدا نشد
                                    </p>
                                    <p className="mt-1 text-xs leading-6 text-gray-500">
                                        عبارت دیگری جستجو کن یا دسته‌بندی را تغییر بده.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setActiveCategory("all");
                                            setOpenFaq(0);
                                        }}
                                        className="mt-4 text-sm font-semibold text-[var(--primary)]"
                                    >
                                        نمایش همه سوالات
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                                <FileText size={18} className="text-[var(--primary)]" />
                                دسته‌بندی راهنما
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setActiveCategory("all");
                                    setOpenFaq(0);
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-right text-sm transition ${
                                    activeCategory === "all"
                                        ? "bg-orange-50 font-semibold text-[var(--primary)]"
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                همه سوالات
                                <ArrowLeft size={15} />
                            </button>

                            {categories.map(({ id, title, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => {
                                        setActiveCategory(id);
                                        setOpenFaq(null);
                                    }}
                                    className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-sm transition ${
                                        activeCategory === id
                                            ? "bg-orange-50 font-semibold text-[var(--primary)]"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon size={17} className="shrink-0" />
                                    <span>{title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[var(--primary)]">
                                <Headset size={21} />
                            </div>

                            <h3 className="mt-3 font-bold text-gray-900">
                                هنوز سوالی داری؟
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-gray-500">
                                اگر جواب سوالت رو پیدا نکردی، تیم پشتیبانی آماده راهنمایی توست.
                            </p>

                            <Link
                                href="/contact"
                                className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-3 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                <MessageCircle size={17} />
                                تماس با پشتیبانی
                                <ArrowLeft size={15} />
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                            <ShieldCheck size={22} className="text-emerald-600" />
                            <h3 className="mt-2 text-sm font-bold text-gray-800">
                                با خیال راحت سفر کن
                            </h3>
                            <p className="mt-1 text-xs leading-6 text-gray-600">
                                پیش از پرداخت، امکانات، ظرفیت و قوانین اقامتگاه انتخابی خودت را بررسی کن.
                            </p>
                        </div>
                    </aside>
                </div>

                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-l from-orange-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm">
                            <CalendarDays size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900">
                                وقت یه سفر خاطره‌انگیزه!
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                اقامتگاه مناسب خودت رو پیدا کن و برای سفر بعدی آماده شو.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/villas"
                        className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        مشاهده ویلاها
                        <ArrowLeft size={16} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
