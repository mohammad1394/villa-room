import React from 'react';

function BookingCard() {
    return (
        <div className="z-10 w-full lg:w-[30%]">

            <div
                className="mx-auto flex min-h-[500px] w-full max-w-[360px] flex-col items-center gap-5 rounded-[16px] bg-white p-5 shadow-lg lg:sticky lg:top-6 lg:mt-[-80px]"
            >
                {/* قیمت */}
                <p className="mt-3 text-center text-[16px] font-bold text-[#66727D] sm:text-[18px]">
                    شب /
                    <span className="text-[#22A06B]">
                                {" "}۳,۵۰۰,۰۰۰ تومان
                            </span>
                </p>

                {/* تاریخ شروع */}
                <div className="flex w-full flex-col gap-3">
                    <label className="text-[13px]">
                        تاریخ شروع
                    </label>

                    <input
                        type="date"
                        className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                    />
                </div>

                {/* تاریخ خروج */}
                <div className="flex w-full flex-col gap-3">
                    <label className="text-[13px]">
                        تاریخ خروج
                    </label>

                    <input
                        type="date"
                        className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                    />
                </div>

                {/* تعداد نفرات */}
                <div className="flex w-full flex-col gap-3">
                    <label className="text-[13px]">
                        تعداد نفرات
                    </label>

                    <input
                        type="number"
                        min="1"
                        className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                    />
                </div>

                {/* دکمه */}
                <button
                    className="mt-5 h-[48px] w-full rounded-[10px] bg-[var(--primary)] text-[14px] font-medium text-white transition hover:opacity-90"
                >
                    رزرو و ادامه
                </button>
            </div>
        </div>
    );
}

export default BookingCard;