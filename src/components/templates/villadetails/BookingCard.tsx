"use client";

import {useParams, useRouter} from "next/navigation";
import {Controller, useForm} from "react-hook-form";
import {BookingCardFormData, bookingCardSchema} from "@/validator/bookingValidator";
import {zodResolver} from "@hookform/resolvers/zod";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";


function BookingCard() {
    const params = useParams<{ id: string }>();
    const router = useRouter();


    const {
        control,
        register,
        handleSubmit,
        watch,
        formState: {errors , isSubmitting},
        getValues,
        setValue
    } = useForm<BookingCardFormData>({
        resolver: zodResolver(bookingCardSchema),
        defaultValues: {
            checkIn: "",
            checkOut: "",
            guests: 1
        },
        mode : "onTouched"
    });

    const checkIn = watch("checkIn");

    const handleBooking = (data: BookingCardFormData) => {

        const query = new URLSearchParams({
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            guests: String(data.guests)
        });

        router.push(`/booking/${params.id}?${query.toString()}`);
    };

    return (
        <div className="z-10 w-full lg:w-[30%]">
            <div
                className="mx-auto flex min-h-[500px] w-full max-w-[360px] flex-col items-center gap-5 rounded-[16px] bg-white p-5 shadow-lg lg:sticky lg:top-6 lg:mt-[-80px]">
                <p className="mt-3 text-center text-[16px] font-bold text-[#66727D] sm:text-[18px]">
                    شب /
                    <span className="text-[#22A06B]">
            {" "}۳,۵۰۰,۰۰۰ تومان
          </span>
                </p>


                <form onSubmit={handleSubmit(handleBooking)}>
                    <div className="flex w-full flex-col gap-3">
                        <label htmlFor="checkIn" className="text-[13px]">
                            تاریخ شروع
                        </label>
                        <Controller
                            name={"checkIn"}
                            control={control}
                            render={({field, fieldState}) => (
                                <div>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={
                                            field.value ?
                                                new DateObject({
                                                    date: field.value,
                                                    calendar: gregorian,
                                                    locale: gregorian_en
                                                }).convert(persian, persian_fa) : ""
                                        }
                                        onChange={(date) => {
                                            const newCheckIn = date
                                                ? date.convert(gregorian, gregorian_en).format("YYYY-MM-DD")
                                                : "";

                                            field.onChange(newCheckIn);

                                            const checkOut = getValues("checkOut");

                                            if (checkOut && newCheckIn && checkOut <= newCheckIn) {
                                                setValue("checkOut", "", {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                            }
                                        }}
                                        format="YYYY/MM/DD"
                                        id="checkIn"
                                        minDate={new DateObject({
                                            calendar: persian,
                                            locale: persian_fa,
                                        })}
                                        inputClass="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                                    />
                                    {fieldState.error &&
                                        <p className="mt-1 text-xs text-red-500">
                                            {fieldState.error?.message}
                                        </p>}
                                </div>
                            )}
                        />
                    </div>

                    <div className="flex w-full flex-col gap-3">
                        <label htmlFor="checkOut" className="text-[13px]">
                            تاریخ خروج
                        </label>
                        <Controller
                            name={"checkOut"}
                            control={control}
                            render={({field, fieldState}) => (
                                <div>
                                    <DatePicker
                                        calendar={persian}
                                        locale={persian_fa}
                                        value={
                                            field.value
                                                ? new DateObject({
                                                    date: field.value,
                                                    calendar: gregorian,
                                                    locale: gregorian_en,
                                                }).convert(persian, persian_fa)
                                                : ""
                                        }
                                        onChange={(date) => {
                                            field.onChange(
                                                date
                                                    ? date
                                                        .convert(gregorian, gregorian_en)
                                                        .format("YYYY-MM-DD")
                                                    : ""
                                            );
                                        }}
                                        format="YYYY/MM/DD"
                                        minDate={
                                            checkIn
                                                ? new DateObject({
                                                    date: checkIn,
                                                    calendar: gregorian,
                                                    locale: gregorian_en,
                                                }).add(1 , "day")
                                                  .convert(persian, persian_fa)
                                                : new DateObject({
                                                    calendar: persian,
                                                    locale: persian_fa,
                                                })
                                        }
                                        inputClass="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                                    />
                                    {fieldState.error &&
                                        <p className="mt-1 text-xs text-red-500">
                                            {fieldState.error?.message}
                                        </p>}
                                </div>
                            )}

                        />
                    </div>

                    <div className="flex w-full flex-col gap-3">
                        <label htmlFor="guests" className="text-[13px]">
                            تعداد نفرات
                        </label>
                        <input
                            id="guests"
                            type="number"
                            {...register("guests", {
                                valueAsNumber: true
                            })}
                            className="h-[44px] w-full rounded-[10px] border border-[#E1E5E8] px-3 text-[12px] outline-none"
                        />
                        {errors.guests && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.guests.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-5 h-[48px] w-full rounded-[10px] bg-[var(--primary)] text-[14px] font-medium text-white transition hover:opacity-90"
                    >
                        {isSubmitting ? "در حال انتقال " : "رزرو و ادامه"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingCard;