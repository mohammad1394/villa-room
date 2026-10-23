"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {Search, UserRound, CalendarDays, MapPin} from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";

function SearchBox() {
    const router = useRouter();

    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState<DateObject | null>(null);
    const [checkOut, setCheckOut] = useState<DateObject | null>(null);
    const [count, setCount] = useState(2);

    const today = new DateObject({calendar: persian});

    const toGregorian = (date: DateObject) => {
        const d = date.toDate();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (destination.trim()) params.set("destination", destination.trim());
        if (checkIn) params.set("checkIn", toGregorian(checkIn));
        if (checkOut) params.set("checkOut", toGregorian(checkOut));

        params.set("count", String(count));

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div
            dir="rtl"
            className="relative z-20 mx-auto flex min-h-[110px] w-[calc(100%-32px)] max-w-[1100px] items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.09)] max-md:flex-col max-md:items-stretch max-md:gap-3 max-md:px-4"
        >
            <div className="flex min-w-0 flex-[1.3] flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <MapPin size={15} className="text-[var(--primary)]"/>
                    مقصد
                </label>

                <div
                    className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-3 transition focus-within:border-[var(--primary)]">
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        placeholder="کجا می‌خوای بری؟"
                        className="w-full bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400"
                    />
                    <Search size={16} className="shrink-0 text-gray-400"/>
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <CalendarDays size={14} className="text-[var(--primary)]"/>
                    تاریخ ورود
                </label>

                <div
                    className="flex h-10 items-center rounded-xl border border-gray-200 px-3 transition focus-within:border-[var(--primary)]">
                    <DatePicker
                        value={checkIn}
                        onChange={(date) => {
                            if (!date) {
                                setCheckIn(null);
                                return;
                            }

                            setCheckIn(date);

                            if (
                                checkOut &&
                                toGregorian(checkOut) <= toGregorian(date)
                            ) {
                                setCheckOut(null);
                            }
                        }}
                        calendar={persian}
                        locale={persian_fa}
                        minDate={today}
                        format="YYYY/MM/DD"
                        placeholder="انتخاب تاریخ"
                        editable={false}
                        calendarPosition="bottom-right"
                        containerClassName="w-full"
                        inputClass="w-full cursor-pointer bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <CalendarDays size={14} className="text-[var(--primary)]"/>
                    تاریخ خروج
                </label>

                <div
                    className="flex h-10 items-center rounded-xl border border-gray-200 px-3 transition focus-within:border-[var(--primary)]">
                    <DatePicker
                        value={checkOut}
                        onChange={(date) => setCheckOut(date || null)}
                        calendar={persian}
                        locale={persian_fa}
                        minDate={checkIn || today}
                        format="YYYY/MM/DD"
                        placeholder="انتخاب تاریخ"
                        editable={false}
                        calendarPosition="bottom-right"
                        containerClassName="w-full"
                        inputClass="w-full cursor-pointer bg-transparent text-[13px] text-gray-800 outline-none placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="flex min-w-0 flex-[0.8] flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <UserRound size={14} className="text-[var(--primary)]"/>
                    تعداد نفرات
                </label>

                <div
                    className="flex h-10 items-center rounded-xl border border-gray-200 px-3 transition focus-within:border-[var(--primary)]">
                    <select
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full cursor-pointer bg-transparent text-[13px] text-gray-800 outline-none"
                    >
                        {Array.from({length: 30}, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                                {n} نفر
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <button
                onClick={handleSearch}
                className="mt-5 flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 text-[13px] font-semibold text-white transition hover:opacity-90 max-md:mt-0 max-md:w-full"
            >
                <Search size={16}/>
                جستجو
            </button>
        </div>
    );
}

export default SearchBox;
