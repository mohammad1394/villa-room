"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DateObject from "react-date-object";
import { z } from "zod";

import {
    ArrowRight,
    CalendarDays,
    ChevronLeft,
    Clock,
    LoaderCircle,
    MapPin,
    Minus,
    Plus,
    ShieldCheck,
    Users,
} from "lucide-react";

import {formatPrice, toGregorianDate} from "@/utility/helper";
import { VillaType } from "@/types/Villa";
import { Controller, useForm } from "react-hook-form";
import {
    BookingFormValues,
    BookingValidator,
} from "@/validator/BookingValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { showCustomToast } from "@/components/modules/layout/toast/toast";


//change url date to Date type
const parseDateParam = (value: string | null): Date | undefined => {
    if (!value) return undefined;

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        const [ ,year, month, day] = match;

        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
        );

        return Number.isNaN(date.getTime()) ? undefined : date;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? undefined : date;
};


const getNightCount = (
    checkIn: Date | undefined,
    checkOut: Date | undefined,
) => {
    if (!checkIn || !checkOut) return 0;

    const start = Date.UTC(
        checkIn.getFullYear(),
        checkIn.getMonth(),
        checkIn.getDate(),
    );

    const end = Date.UTC(
        checkOut.getFullYear(),
        checkOut.getMonth(),
        checkOut.getDate(),
    );

    return Math.max(0, (end - start) / 86_400_000);
};


const toDateObject = (date: Date | undefined) => {
    if (!date) return null;

    return new DateObject({
        date,
        calendar: persian,
        locale: persian_fa,
    });
};

export default function BookingPage() {
    const params = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const router = useRouter();

    const villaId = params.id;

    const [villa, setVilla] = useState<VillaType | null>(null);
    const [pageError, setPageError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    const initialCheckIn = parseDateParam(searchParams.get("checkIn"));
    const initialCheckOut = parseDateParam(searchParams.get("checkOut"));

    const initialGuests = Number(searchParams.get("guests") ?? "1");


    const {
        handleSubmit,
        register,
        control,
        watch,
        setValue,
        getValues,
        setError: setFormError,
        formState: { errors, isSubmitting },
    } = useForm<
        z.input<typeof BookingValidator>,
        unknown,
        BookingFormValues
    >({
        resolver: zodResolver(BookingValidator),
        defaultValues: {
            checkIn: initialCheckIn,
            checkOut: initialCheckOut,
            guests:
                Number.isInteger(initialGuests) && initialGuests >= 1
                    ? initialGuests
                    : 1,
            fullName: "",
            phoneNumber: "",
            description: "",
        },
    });


    const checkIn = watch("checkIn");
    const checkOut = watch("checkOut");
    const guests = watch("guests");

   // get vill information
    useEffect(() => {
        if (!villaId) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadVilla = async () => {
            try {
                setLoading(true);
                setPageError("");

                const response = await fetch(
                    `/api/villa/${encodeURIComponent(villaId)}`,
                    {
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error("اطلاعات ویلا دریافت نشد.");
                }

                const data = await response.json();
                const item = data.villa as VillaType;

                if (!item?._id || typeof item.pricePerNight !== "number") {
                    throw new Error(
                        "ساختار اطلاعات دریافتی ویلا معتبر نیست.",
                    );
                }

                setVilla(item);

                const maximum = Math.max(
                    1,
                    Number(item.capacity ?? 10),
                );

                const currentGuests = getValues("guests") || 1;

                // محدود کردن تعداد مهمان‌ها به ظرفیت ویلا
                setValue(
                    "guests",
                    Math.min(Math.max(1, currentGuests), maximum),
                );
            } catch (err) {
                if (
                    err instanceof Error &&
                    err.name !== "AbortError"
                ) {
                    setPageError(
                        err.message || "خطا در دریافت اطلاعات ویلا.",
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadVilla();

        return () => controller.abort();
    }, [villaId, getValues, setValue]);

    // محاسبه هزینه اقامت
    const nights = getNightCount(checkIn, checkOut);

    const pricePerNight = villa?.pricePerNight ?? 0;
    const totalPrice = nights * pricePerNight;

    const maxGuests = Math.max(
        1,
        Number(villa?.capacity ?? 10),
    );

    const villaTitle = villa?.title ?? "اقامتگاه";
    const villaImage = villa?.images?.[0];

    const location = [villa?.city].filter(Boolean).join("، ");

    // تغییر تاریخ ورود
    const handleCheckInChange = (date: DateObject | null) => {
        if (!date) {
            setValue("checkIn", undefined as unknown as Date, {
                shouldValidate: true,
                shouldDirty: true,
            });

            return;
        }

        const selectedDate = date.toDate();

        setValue("checkIn", selectedDate, {
            shouldValidate: true,
            shouldDirty: true,
        });

        // اگر تاریخ خروج قبل از تاریخ ورود جدید باشد، آن را پاک می‌کنیم
        if (checkOut && selectedDate >= checkOut) {
            setValue("checkOut", undefined as unknown as Date, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    // ثبت درخواست رزرو
    const formSubmitting = async (values: BookingFormValues) => {
        if (!villa) {
            setPageError("ویلایی برای رزرو پیدا نشد.");
            return;
        }

        setPageError("");
        setSuccess("");

        // بررسی ظرفیت واقعی ویلا
        if (values.guests > maxGuests) {
            setFormError("guests", {
                type: "manual",
                message: `ظرفیت این ویلا حداکثر ${maxGuests} نفر است.`,
            });

            return;
        }

        try {
            const response = await fetch("/api/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    villaId: villa._id,
                    checkIn: toGregorianDate(values.checkIn),
                    checkOut: toGregorianDate(values.checkOut),
                    guests: values.guests,
                    fullName: values.fullName.trim(),
                    phoneNumber: values.phoneNumber.trim(),
                    note: values.description?.trim() ?? "",
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "ثبت رزرو انجام نشد.",
                );
            }

            const successMessage =
                data.message || "درخواست رزرو با موفقیت ثبت شد.";

            setSuccess(successMessage);

            showCustomToast(
                "موفق",
                successMessage,
                "check",
                "success",
            );

            // انتقال کاربر به رزروهایش
            router.push("/panel/my-bookings");
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "خطایی در ثبت رزرو رخ داد.";

            setPageError(message);

            showCustomToast(
                "خطا",
                message,
                "x",
                "error",
            );
        }
    };

    // وضعیت دریافت اطلاعات ویلا
    if (loading) {
        return (
            <main
                dir="rtl"
                className="flex min-h-[60vh] items-center justify-center"
            >
                <div className="flex items-center gap-3 text-gray-500">
                    <LoaderCircle
                        className="animate-spin"
                        size={22}
                    />
                    <span>در حال دریافت اطلاعات ویلا...</span>
                </div>
            </main>
        );
    }

    // در صورت پیدا نشدن ویلا
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
                    {pageError ||
                        "ممکن است ویلا حذف شده باشد یا آدرس آن اشتباه باشد."}
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
        <main
            dir="rtl"
            className="min-h-screen bg-gray-50 pb-12"
        >
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
                <Link
                    href={`/villas/${villa._id}`}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
                >
                    <ArrowRight size={18} />
                    بازگشت به جزئیات ویلا
                </Link>

                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                        رزرو اقامتگاه
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        اطلاعات اقامتت را وارد کن و جزئیات رزرو را بررسی
                        کن.
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        {/* اطلاعات ویلا */}
                        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
                                <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-48">
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
                                            <MapPin size={16} />
                                            {location}
                                        </p>
                                    )}

                                    <p className="mt-3 text-sm text-gray-600">
                                        <span className="font-bold text-gray-900">
                                            {formatPrice(pricePerNight)}
                                        </span>{" "}
                                        تومان
                                        <span className="text-gray-400">
                                            {" "}
                                            / هر شب
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </section>

                        <form
                            onSubmit={handleSubmit(formSubmitting)}
                            className="space-y-6"
                            noValidate
                        >
                            {/* تاریخ اقامت */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                        <CalendarDays size={20} />
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
                                    {/* تاریخ ورود */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            تاریخ ورود
                                        </label>

                                        <Controller
                                            name="checkIn"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={toDateObject(field.value)}
                                                    onChange={(date) => {
                                                        if (
                                                            date &&
                                                            !Array.isArray(date)
                                                        ) {
                                                            handleCheckInChange(
                                                                date,
                                                            );
                                                        } else {
                                                            handleCheckInChange(
                                                                null,
                                                            );
                                                        }
                                                    }}
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    format="YYYY/MM/DD"
                                                    minDate={
                                                        new DateObject({
                                                            date: new Date(),
                                                            calendar: persian,
                                                            locale: persian_fa,
                                                        })
                                                    }
                                                    calendarPosition="bottom-right"
                                                    inputClass={`w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none transition focus:border-[var(--primary)] ${
                                                        errors.checkIn
                                                            ? "border-red-400"
                                                            : "border-gray-200"
                                                    }`}
                                                    containerClassName="w-full"
                                                    placeholder="انتخاب تاریخ ورود"
                                                />
                                            )}
                                        />

                                        {errors.checkIn && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.checkIn.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* تاریخ خروج */}
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            تاریخ خروج
                                        </label>

                                        <Controller
                                            name="checkOut"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={toDateObject(field.value)}
                                                    onChange={(date) => {
                                                        if (
                                                            date &&
                                                            !Array.isArray(date)
                                                        ) {
                                                            field.onChange(
                                                                date.toDate(),
                                                            );
                                                        } else {
                                                            field.onChange(
                                                                undefined,
                                                            );
                                                        }
                                                    }}
                                                    calendar={persian}
                                                    locale={persian_fa}
                                                    format="YYYY/MM/DD"
                                                    minDate={
                                                        checkIn
                                                            ? new DateObject({
                                                                date: checkIn,
                                                                calendar: persian,
                                                                locale: persian_fa,
                                                            }).add(1, "day")
                                                            : new DateObject({
                                                                date: new Date(),
                                                                calendar: persian,
                                                                locale: persian_fa,
                                                            })
                                                    }
                                                    calendarPosition="bottom-right"
                                                    inputClass={`w-full rounded-xl border bg-white px-3 py-3 text-sm outline-none transition focus:border-[var(--primary)] ${
                                                        errors.checkOut
                                                            ? "border-red-400"
                                                            : "border-gray-200"
                                                    }`}
                                                    containerClassName="w-full"
                                                    placeholder="انتخاب تاریخ خروج"
                                                    disabled={!checkIn}
                                                />
                                            )}
                                        />

                                        {errors.checkOut && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.checkOut.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {nights > 0 && (
                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                                        <Clock size={17} />
                                        مدت اقامت:

                                        <strong className="text-gray-900">
                                            {formatPrice(nights)} شب
                                        </strong>
                                    </div>
                                )}
                            </section>

                            {/* تعداد مهمان‌ها */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                                        <Users size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            تعداد مهمان‌ها
                                        </h2>

                                        <p className="mt-1 text-xs text-gray-500">
                                            ظرفیت مجاز ویلا{" "}
                                            {formatPrice(maxGuests)} نفر است.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            بزرگسال و کودک
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            تعداد کل مهمان‌ها
                                        </p>
                                    </div>

                                    <Controller
                                        name="guests"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex items-center gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        field.onChange(
                                                            Math.max(
                                                                1,
                                                                field.value - 1,
                                                            ),
                                                        )
                                                    }
                                                    disabled={field.value <= 1}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Minus size={16} />
                                                </button>

                                                <span className="min-w-5 text-center font-bold text-gray-900">
                                                    {field.value}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        field.onChange(
                                                            Math.min(
                                                                maxGuests,
                                                                field.value + 1,
                                                            ),
                                                        )
                                                    }
                                                    disabled={
                                                        field.value >= maxGuests
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>

                                {errors.guests && (
                                    <p className="mt-2 text-xs text-red-500">
                                        {errors.guests.message}
                                    </p>
                                )}
                            </section>

                            {/* اطلاعات رزروکننده */}
                            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
                                <h2 className="mb-5 font-bold text-gray-900">
                                    اطلاعات رزروکننده
                                </h2>

                                <div className="space-y-4">
                                    {/* نام و نام خانوادگی */}
                                    <div>
                                        <label
                                            htmlFor="fullName"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            نام و نام خانوادگی
                                        </label>

                                        <input
                                            id="fullName"
                                            {...register("fullName")}
                                            autoComplete="name"
                                            aria-invalid={!!errors.fullName}
                                            placeholder="نام کامل خود را وارد کن"
                                            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] ${
                                                errors.fullName
                                                    ? "border-red-400"
                                                    : "border-gray-200"
                                            }`}
                                        />

                                        {errors.fullName && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.fullName.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* شماره موبایل */}
                                    <div>
                                        <label
                                            htmlFor="phoneNumber"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            شماره موبایل
                                        </label>

                                        <input
                                            id="phoneNumber"
                                            {...register("phoneNumber")}
                                            type="tel"
                                            dir="ltr"
                                            autoComplete="tel"
                                            aria-invalid={!!errors.phoneNumber}
                                            placeholder="09123456789"
                                            className={`w-full rounded-xl px-4 py-3 text-left text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] ${
                                                errors.phoneNumber
                                                    ? "border-red-400"
                                                    : "border border-gray-200"
                                            }`}
                                        />

                                        {errors.phoneNumber && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.phoneNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* توضیحات اضافی */}
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            توضیحات اضافی

                                            <span className="mr-1 font-normal text-gray-400">
                                                (اختیاری)
                                            </span>
                                        </label>

                                        <textarea
                                            id="description"
                                            {...register("description")}
                                            rows={3}
                                            maxLength={300}
                                            aria-invalid={!!errors.description}
                                            placeholder="اگر درخواست خاصی داری اینجا بنویس."
                                            className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-[var(--primary)] ${
                                                errors.description
                                                    ? "border-red-400"
                                                    : "border-gray-200"
                                            }`}
                                        />

                                        {errors.description && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.description.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* خطاهای کلی صفحه */}
                            {pageError && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm leading-6 text-red-700"
                                >
                                    {pageError}
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

                            {/* خلاصه هزینه در موبایل */}
                            <div className="lg:hidden">
                                <PriceSummary
                                    pricePerNight={pricePerNight}
                                    nights={nights}
                                    totalPrice={totalPrice}
                                />
                            </div>

                            {/* دکمه ثبت رزرو */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-4 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoaderCircle
                                            className="animate-spin"
                                            size={19}
                                        />
                                        در حال ثبت درخواست...
                                    </>
                                ) : (
                                    <>
                                        ثبت درخواست رزرو
                                        <ChevronLeft size={19} />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs leading-6 text-gray-500">
                                با ثبت درخواست، اطلاعات رزرو برای بررسی به
                                سامانه ارسال می‌شود. ثبت درخواست به‌تنهایی به
                                معنی تأیید نهایی یا پرداخت نیست.
                            </p>
                        </form>
                    </div>

                    {/* خلاصه هزینه در دسکتاپ */}
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

                            <div className="my-5 border-t border-gray-100" />

                            <div className="flex items-start gap-3 text-sm text-gray-600">
                                <ShieldCheck
                                    className="mt-0.5 shrink-0 text-[var(--primary)]"
                                    size={20}
                                />

                                <p className="leading-6">
                                    قبل از تأیید نهایی، وضعیت ظرفیت و شرایط
                                    رزرو باید در سرور بررسی شود.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/contact-us"
                            className="block rounded-2xl border border-gray-200 bg-white p-4 text-sm transition hover:border-gray-300"
                        >
                            <p className="font-bold text-gray-800">
                                به راهنمایی نیاز داری؟
                            </p>

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

// کامپوننت خلاصه هزینه
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
                    {formatPrice(pricePerNight)} تومان ×{" "}
                    {formatPrice(nights)} شب
                </span>

                <span className="font-medium text-gray-800">
                    {formatPrice(totalPrice)} تومان
                </span>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-gray-900">
                        مبلغ اقامت
                    </span>

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