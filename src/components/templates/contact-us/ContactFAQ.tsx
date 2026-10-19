"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const questions = [
    "چگونه می‌توانم یک ویلا رزرو کنم؟",
    "آیا امکان لغو یا تغییر رزرو وجود دارد؟",
    "اگر هنگام رزرو با مشکل مواجه شدم چه کار کنم؟",
    "چه روش‌هایی برای پرداخت هزینه وجود دارد؟",
    "چگونه می‌توانم ویلای مورد نظر خود را پیدا کنم؟",
];

export default function ContactFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="my-6 sm:my-8">

            <h2 className="mb-5 text-center text-[16px] font-bold text-[var(--text-primary)] sm:text-[18px]">
                سوالات متداول
            </h2>

            <div className="overflow-hidden rounded-[9px] border border-gray-200 bg-white">

                {questions.map((question, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className="border-b border-gray-100 last:border-b-0"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                className="
                                    flex min-h-[38px] w-full
                                    items-center justify-between
                                    gap-3 px-3
                                    text-right
                                    sm:min-h-[42px]
                                    sm:px-4
                                "
                            >
                                <span className="text-[9px] text-[var(--text-primary)] sm:text-[13px]">
                                    {question}
                                </span>

                                <Plus
                                    size={13}
                                    className={`
                                        shrink-0 text-[var(--text-secondary)]
                                        transition-transform
                                        ${isOpen ? "rotate-45" : ""}
                                    `}
                                />
                            </button>

                            <div
                                className={`
                                    grid transition-all duration-200
                                    ${isOpen
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                                }
                                `}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-4 pb-3 text-[9px] leading-5 text-[var(--text-secondary)]">
                                        برای دریافت اطلاعات بیشتر می‌توانید
                                        با تیم پشتیبانی ویلاروم تماس بگیرید.
                                        کارشناسان ما در سریع‌ترین زمان ممکن
                                        پاسخگوی شما خواهند بود.
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

            </div>
        </section>
    );
}