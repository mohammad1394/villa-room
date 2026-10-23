"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {showCustomToast} from "@/components/modules/layout/toast/toast";

function BookingCard() {
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);

    const handleBooking = () => {
        if (!checkIn || !checkOut) {

            showCustomToast(
                "خطا",
                "لطفاً تاریخ ورود و خروج را انتخاب کن",
                "x",
                "error"
            )
            return;
        }

        if (checkOut <= checkIn) {
            showCustomToast(
                "خطا",
                "تاریخ خروج باید بعد از تاریخ ورود باشد.",
                "x",
                "error"
            )
            return;
        }

        if (guests < 1) {
            showCustomToast(
                "خطا",
                "تغداد مهمانان را وارد کنید",
                "x",
                "error"
            )
            return;
        }

        const query = new URLSearchParams({
            checkIn,
            checkOut,
            guests: String(guests),
        });

        router.push(`/booking/${params.id}?${query.toString()}`);
    };

    return (
        <div className="z-10 w-full lg:w-[30%]">
            <div className="mx-auto flex min-h-[500px] w-full max-w-[360px] flex-col items-center gap-5 rounded-[16px] bg-white p-5 shadow-lg lg:sticky lg:top-6 lg:mt-[-80px]">
                <p className="mt-3 text-center text-[16px] font-bold text-[#66727D] sm:text-[18px]">
                    شب /
                    <span className="text-[#22A06B]">
            {" "}۳,۵۰۰,۰۰۰ تومان
          </span>
                </p>

                <div className="flex w-full flex-col gap-3">
                    <label htmlFor="checkIn" className="text-[13px]">
                        تاریخ شروع
                    </label>
                    <input
                        id="checkIn"
                        type="date"
                        value={checkIn}
                        min={new Date().toLocaleDateString("en-CA")}
                        onChange={(event) => setCheckIn(event.target.value)}
                        className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                    />
                </div>

                <div className="flex w-full flex-col gap-3">
                    <label htmlFor="checkOut" className="text-[13px]">
                        تاریخ خروج
                    </label>
                    <input
                        id="checkOut"
                        type="date"
                        value={checkOut}
                        min={checkIn || new Date().toLocaleDateString("en-CA")}
                        onChange={(event) => setCheckOut(event.target.value)}
                        className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                    />
                </div>

                <div className="flex w-full flex-col gap-3">
                    <label htmlFor="guests" className="text-[13px]">
                        تعداد نفرات
                    </label>
                    <input
                        id="guests"
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(event) =>
                            setGuests(Math.max(1, Number(event.target.value)))
                        }
                        className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleBooking}
                    className="mt-5 h-[48px] w-full rounded-[10px] bg-[var(--primary)] text-[14px] font-medium text-white transition hover:opacity-90"
                >
                    رزرو و ادامه
                </button>
            </div>
        </div>
    );
}

export default BookingCard;