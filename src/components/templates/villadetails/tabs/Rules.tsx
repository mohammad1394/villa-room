import React from 'react';
import {Cigarette, Clock, Music, ShieldCheck, Users} from "lucide-react";

function Rules({capacity} : {capacity: number}) {
    return (
        <div className="space-y-5">

            <div className="flex items-start gap-3">
                <Clock
                    size={20}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                />

                <div>
                    <p className="text-[13px] font-semibold text-[#172B3A]">
                        ساعت ورود و خروج
                    </p>

                    <p className="mt-1 text-[12px] leading-6 text-[#66727D]">
                        ساعت ورود از ۱۴:۰۰ و ساعت خروج تا ۱۲:۰۰ است.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Users
                    size={20}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                />

                <div>
                    <p className="text-[13px] font-semibold text-[#172B3A]">
                        ظرفیت مهمان
                    </p>

                    <p className="mt-1 text-[12px] leading-6 text-[#66727D]">
                        حداکثر ظرفیت ویلا {capacity} نفر است و پذیرش مهمان اضافه
                        تنها با هماهنگی قبلی امکان‌پذیر است.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Music
                    size={20}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                />

                <div>
                    <p className="text-[13px] font-semibold text-[#172B3A]">
                        برگزاری مهمانی
                    </p>

                    <p className="mt-1 text-[12px] leading-6 text-[#66727D]">
                        برگزاری مهمانی و مراسم بدون هماهنگی با میزبان
                        مجاز نیست.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <Cigarette
                    size={20}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                />

                <div>
                    <p className="text-[13px] font-semibold text-[#172B3A]">
                        استعمال دخانیات
                    </p>

                    <p className="mt-1 text-[12px] leading-6 text-[#66727D]">
                        استعمال دخانیات داخل فضای داخلی ویلا مجاز نیست.
                    </p>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <ShieldCheck
                    size={20}
                    strokeWidth={1.8}
                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                />

                <div>
                    <p className="text-[13px] font-semibold text-[#172B3A]">
                        حفظ و نگهداری وسایل
                    </p>

                    <p className="mt-1 text-[12px] leading-6 text-[#66727D]">
                        مهمان موظف است در طول اقامت از وسایل و تجهیزات
                        ویلا به خوبی نگهداری کند.
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Rules;