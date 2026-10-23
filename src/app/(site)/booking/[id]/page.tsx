"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    Clock,
    LoaderCircle,
    MapPin,
    Minus,
    Plus,
    ShieldCheck,
    Users,
} from "lucide-react";
import {formatPrice} from "@/utility/helper";
import {VillaType} from "@/types/Villa";
import {validatePhone} from "@/utility/auth";


const toPersianDate = (date: DateObject | null) =>
    date ? date.format("YYYY/MM/DD") : "";

const toGregorianDate = (date: DateObject | null) => {
    if (!date) return "";
    const value = date.toDate();
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getNightCount = (
    checkIn: DateObject | null,
    checkOut: DateObject | null,
) => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(toGregorianDate(checkIn)).getTime();
    const end = new Date(toGregorianDate(checkOut)).getTime();


    return Math.max(0, Math.round((end - start) / 86_400_000));
};

export default function BookingPage() {
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();
    const villaId = params.id;

    const [villa, setVilla] = useState<VillaType | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [checkIn, setCheckIn] = useState<DateObject | null>(() => {
        const value = searchParams.get("checkIn");
        return value
            ? new DateObject({date: value, calendar: persian})
            : null;
    });

    const [checkOut, setCheckOut] = useState<DateObject | null>(() => {
        const value = searchParams.get("checkOut");
        return value
            ? new DateObject({date: value, calendar: persian})
            : null;
    });

    const [guests, setGuests] = useState(() => {
        const value = Number(searchParams.get("guests") ?? "1");
        return Number.isInteger(value) && value >= 1 ? value : 1;
    });



    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!villaId) return;

        const controller = new AbortController();

        const loadVilla = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/villa/${encodeURIComponent(villaId)}`,
                    {signal: controller.signal},
                );

                if (!response.ok) {
                    throw new Error("اطلاعات ویلا دریافت نشد.");
                }

                const data = await response.json();
                const item = data.villa

                if (!item?._id || typeof item.pricePerNight !== "number") {
                    throw new Error("ساختار اطلاعات دریافتی ویلا معتبر نیست.");
                }

                setVilla(item);

                const maximum = item.capacity ?? item.maxGuests ?? 10;

                setGuests((currentGuests) =>
                    Math.min(Math.max(1, currentGuests), maximum)
                );


            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err.message || "خطا در دریافت اطلاعات ویلا.");
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        loadVilla();

        return () => controller.abort();
    }, [villaId]);


    const nights = getNightCount(checkIn, checkOut);
    const pricePerNight = villa?.pricePerNight ?? 0;
    const totalPrice = nights * pricePerNight;
    const maxGuests = villa?.capacity

    const villaTitle = villa?.title ??  "اقامتگاه";
    const villaImage = villa?.images[1]


    console.log(villa)


    const location = [villa?.city].filter(Boolean).join("، ");

    const handleCheckInChange = (date: DateObject | null) => {
        setCheckIn(date);

        if (
            date &&
            checkOut &&
            date.toDate().getTime() >= checkOut.toDate().getTime()
        ) {
            setCheckOut(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!villa || !checkIn || !checkOut) {
            setError("لطفاً تاریخ ورود و خروج را انتخاب کن.");
            return;
        }

        if (nights < 1) {
            setError("تاریخ خروج باید بعد از تاریخ ورود باشد.");
            return;
        }

        if (guests < 1 ) {
            setError(`ظرفیت این ویلا حداکثر ${maxGuests} نفر است.`);
            return;
        }

        if (!validatePhone(phoneNumber.trim())) {
            setError("شماره موبایل باید با 09 شروع شود و 11 رقم داشته باشد.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch("/api/booking", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    villaId: villa._id,
                    checkIn: toGregorianDate(checkIn),
                    checkOut: toGregorianDate(checkOut),
                    guests,
                    fullName: fullName.trim(),
                    phoneNumber: phoneNumber.trim(),
                    note: note.trim(),
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || data.error || "ثبت رزرو انجام نشد.");
            }

            setSuccess(data.message || "درخواست رزرو با موفقیت ثبت شد.");

            if (data.booking?._id || data.bookingId) {
                const bookingId = data.booking?._id ?? data.bookingId;

                setTimeout(() => {
                    router.push(`/panel/my-bookings`);
                }, 1000);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "خطایی در ثبت رزرو رخ داد.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main
                dir="rtl"
                className="flex min-h-[60vh] items-center justify-center"
            >
                <div className="flex items-center gap-3 text-gray-500">
                    <LoaderCircle className="animate-spin" size={22}/>
                    <span>در حال دریافت اطلاعات ویلا...</span>
                </div>
            </main>
        );
    }

    if (!villa) {
        return (
            <main
                dir="rtl"
                className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center"
            >
                <h1 className="text-xl font-bold text-gray-800">
                    اطلاعات ویلا در دسترس نیست
                </h1>
                <p className="text-sm text-gray-500">
                    {error || "ممکن است ویلا حذف شده باشد یا آدرس آن اشتباه باشد."}
                </p>
                <Link
                    href="/villas"
                    className="rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                    مشاهده ویلاها
                </Link>
            </main>
        );
    }

    return (
        <main dir="rtl" className="min-h-screen bg-gray-50 pb-12">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
                <Link
                    href={`/villas/${villa._id}`}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
                >
                    <ArrowRight size={18}/>
                    بازگشت به جزئیات ویلا
                </Link>

                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                        رزرو اقامتگاه
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        اطلاعات اقامتت را وارد کن و جزئیات رزرو را بررسی کن.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                                <div
                                    className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-48">
                                    {villaImage ? (
                                        <img
                                            src={villaImage}
                                            alt={villaTitle}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                            تصویر موجود نیست
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col justify-center">
                  <span className="mb-2 text-xs font-semibold text-[var(--primary)]">
                    اقامتگاه انتخابی شما
                  </span>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {villaTitle}
                                    </h2>

                                    {location && (
                                        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                                            <MapPin size={16}/>
                                            {location}
                                        </p>
                                    )}

                                    <p className="mt-3 text-sm text-gray-600">
                    <span className="font-bold text-gray-900">
                      {formatPrice(pricePerNight)}
                    </span>{" "}
                                        تومان
                                        <span className="text-gray-400"> / هر شب</span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                        <CalendarDays size={20}/>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            تاریخ اقامت
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500">
                                            تاریخ ورود و خروج را مشخص کن.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            تاریخ ورود
                                        </label>
                                        <DatePicker
                                            value={checkIn}
                                            onChange={handleCheckInChange}
                                            calendar={persian}
                                            locale={persian_fa}
                                            format="YYYY/MM/DD"
                                            minDate={new DateObject({calendar: persian})}
                                            calendarPosition="bottom-right"
                                            inputClass="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                                            containerClassName="w-full"
                                            placeholder="انتخاب تاریخ ورود"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            تاریخ خروج
                                        </label>
                                        <DatePicker
                                            value={checkOut}
                                            onChange={setCheckOut}
                                            calendar={persian}
                                            locale={persian_fa}
                                            format="YYYY/MM/DD"
                                            minDate={
                                                checkIn
                                                    ? new DateObject(checkIn).add(1, "day")
                                                    : new DateObject({calendar: persian}).add(1, "day")
                                            }
                                            calendarPosition="bottom-right"
                                            inputClass="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                                            containerClassName="w-full"
                                            placeholder="انتخاب تاریخ خروج"
                                        />
                                    </div>
                                </div>

                                {nights > 0 && (
                                    <div
                                        className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                                        <Clock size={17}/>
                                        مدت اقامت:
                                        <strong className="text-gray-900">
                                            {formatPrice(nights)} شب
                                        </strong>
                                    </div>
                                )}
                            </section>

                            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                        <Users size={20}/>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            تعداد مهمان‌ها
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500">
                                            ظرفیت مجاز ویلا {formatPrice(villa.capacity)} نفر است.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            بزرگسال و کودک
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            تعداد کل مهمان‌ها
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setGuests((value) => Math.max(1, guests - 1))}
                                            disabled={guests <= 1}
                                            aria-label="کاهش تعداد مهمان"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Minus size={16}/>
                                        </button>

                                        <span className="min-w-5 text-center font-bold">
                      {formatPrice(guests)}
                    </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setGuests((value) => Math.min(guests, value + 1))
                                            }
                                            disabled={guests >= villa.capacity}
                                            aria-label="افزایش تعداد مهمان"
                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Plus size={16}/>
                                        </button>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-5 font-bold text-gray-900">
                                    اطلاعات رزروکننده
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            نام و نام خانوادگی
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            value={fullName}
                                            onChange={(event) => setFullName(event.target.value)}
                                            required
                                            minLength={3}
                                            autoComplete="name"
                                            placeholder="نام کامل خود را وارد کن"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phoneNumber"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            شماره موبایل
                                        </label>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            dir="ltr"
                                            value={phoneNumber}
                                            onChange={(event) => setPhoneNumber(event.target.value)}
                                            required
                                            inputMode="numeric"
                                            pattern="09[0-9]{9}"
                                            maxLength={11}
                                            autoComplete="tel"
                                            placeholder="09123456789"
                                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm transition outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="note"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            توضیحات اضافی
                                            <span className="mr-1 font-normal text-gray-400">
                        (اختیاری)
                      </span>
                                        </label>
                                        <textarea
                                            id="note"
                                            name="note"
                                            value={note}
                                            onChange={(event) => setNote(event.target.value)}
                                            rows={3}
                                            maxLength={500}
                                            placeholder="اگر درخواست خاصی داری اینجا بنویس."
                                            className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm transition outline-none placeholder:text-gray-400 focus:border-[var(--primary)]"
                                        />
                                    </div>
                                </div>
                            </section>

                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700"
                                >
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div
                                    role="status"
                                    className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm leading-6 text-green-700"
                                >
                                    {success}
                                </div>
                            )}

                            <div className="lg:hidden">
                                <PriceSummary
                                    pricePerNight={pricePerNight}
                                    nights={nights}
                                    totalPrice={totalPrice}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || nights < 1}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle className="animate-spin" size={19}/>
                                        در حال ثبت درخواست...
                                    </>
                                ) : (
                                    <>
                                        ثبت درخواست رزرو
                                        <ChevronLeft size={19}/>
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs leading-6 text-gray-500">
                                با ثبت درخواست، اطلاعات رزرو برای بررسی به سامانه ارسال می‌شود.
                                ثبت درخواست به‌تنهایی به معنی تأیید نهایی یا پرداخت نیست.
                            </p>
                        </form>
                    </div>

                    <aside className="hidden space-y-5 lg:sticky lg:top-6 lg:block">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <h2 className="mb-5 text-lg font-bold text-gray-900">
                                خلاصه هزینه
                            </h2>

                            <PriceSummary
                                pricePerNight={pricePerNight}
                                nights={nights}
                                totalPrice={totalPrice}
                            />

                            <div className="my-5 border-t border-gray-100"/>

                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <ShieldCheck
                                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                                    size={20}
                                />
                                <p className="leading-6">
                                    قبل از تأیید نهایی، وضعیت ظرفیت و شرایط رزرو باید در سرور
                                    بررسی شود.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/contact-us"
                            className="block rounded-2xl border border-gray-200 bg-white p-4 text-sm transition hover:border-gray-300"
                        >
                            <p className="font-bold text-gray-800">به راهنمایی نیاز داری؟</p>
                            <p className="mt-1 text-gray-500">
                                با پشتیبانی ویلاروم تماس بگیر.
                            </p>
                        </Link>
                    </aside>
                </div>
            </div>
        </main>
    );
}

function PriceSummary({
                          pricePerNight,
                          nights,
                          totalPrice,
                      }: {
    pricePerNight: number;
    nights: number;
    totalPrice: number;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-gray-600">
          {formatPrice(pricePerNight)} تومان × {formatPrice(nights)} شب
        </span>
                <span className="font-medium text-gray-800">
          {formatPrice(totalPrice)} تومان
        </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-gray-900">مبلغ اقامت</span>
                    <span className="text-lg font-extrabold text-gray-900">
            {formatPrice(totalPrice)}
                        <span className="mr-1 text-xs font-normal text-gray-500">
              تومان
            </span>
          </span>
                </div>
            </div>
        </div>
    );
}