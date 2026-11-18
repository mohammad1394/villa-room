"use client";

import {useState} from "react";
import {CalendarDays, Percent, Tag, X} from "lucide-react";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
    createDiscountSchema,
    DiscountFormInput,
    DiscountFormOutput,
} from "@/validator/discountValidator";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

type VillaOption = {
    _id: string;
    title: string;
};

interface CreateDiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    villas: VillaOption[];
    onSubmit: (data: {
        code: string;
        villaId: string;
        maxUse: number;
        expire: string;
        percent: number;
    }) => void;
}

export default function CreateDiscountModal({
                                                isOpen,
                                                onClose,
                                                villas,
                                                onSubmit,
                                            }: CreateDiscountModalProps) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<DiscountFormInput, any, DiscountFormOutput>({
        resolver: zodResolver(createDiscountSchema),
        defaultValues: {
            code: "",
            maxUse: 0,
            percent: 0,
            villaId: "",
            expire: "",
        },
    });

    if (!isOpen) {
        return null;
    }

    const sendDiscoutninfo = (data: DiscountFormOutput) => {

        onSubmit({
            code : data.code,
            villaId : data.villaId,
            maxUse: data.maxUse,
            expire: data.expire.toISOString(),
            percent: data.percent,
        });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h2 className="text-base font-bold text-gray-800">
                            ایجاد کد تخفیف
                        </h2>
                        <p className="mt-1 text-xs text-gray-400">
                            اطلاعات کد تخفیف جدید را وارد کنید
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={19}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit(sendDiscoutninfo)}>
                    <div className="space-y-4 p-5">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                کد تخفیف
                            </label>

                            <div className="relative">
                                <Tag
                                    size={17}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    {...register("code")}
                                    placeholder="مثلاً VILLA20"
                                    className="focus:border-primary h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 transition outline-none placeholder:text-gray-300 focus:bg-white"
                                />
                                {errors.code && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors?.code.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                ویلا
                            </label>

                            <select
                                {...register("villaId")}
                                className="focus:border-primary h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600 transition outline-none focus:bg-white"
                            >
                                <option value="">
                                    انتخاب ویلا
                                </option>

                                {villas.map((villa) => (
                                    <option
                                        key={villa._id}
                                        value={villa._id}
                                    >
                                        {villa.title}
                                    </option>
                                ))}
                            </select>
                            {errors.villaId && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.villaId.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-600">
                                    درصد تخفیف
                                </label>

                                <div className="relative">
                                    <Percent
                                        size={17}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="number"
                                        {...register("percent", { valueAsNumber: true })}
                                        placeholder="مثلاً 20"
                                        className="focus:border-primary h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 transition outline-none placeholder:text-gray-300 focus:bg-white"
                                    />
                                    {errors.percent && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors?.percent.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-600">
                                    حداکثر تعداد استفاده
                                </label>

                                <input
                                    type="number"
                                    {...register("maxUse", { valueAsNumber: true })}
                                    placeholder="مثلاً 100"
                                    className="focus:border-primary h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 transition outline-none placeholder:text-gray-300 focus:bg-white"
                                />
                                {errors.maxUse && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.maxUse.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                تاریخ انقضا
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                                />
                                <Controller control={control} name={"expire"} render={({field, fieldState}) => (
                                    <>
                                        <DatePicker
                                            calendar={persian}
                                            locale={persian_fa}
                                            format={"YYYY-MM-DD"}
                                            value={field.value ? new DateObject({
                                                date: field.value,
                                                calendar: gregorian,
                                                locale: gregorian_en
                                            }).convert(persian, persian_fa) : " "}
                                            onChange={(date) => {
                                                const newExpire = date ? date.toDate().toISOString() : ""
                                                field.onChange(newExpire);
                                            }
                                            }
                                            minDate={new DateObject({
                                                calendar: persian,
                                                locale: persian_fa,
                                            })}
                                            inputClass="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:bg-white"
                                        />
                                        {fieldState.error && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                                />


                            </div>
                        </div>
                    </div>

                    <div
                        className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 rounded-xl border border-gray-200 bg-white px-5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            انصراف
                        </button>

                        <button
                            type="submit"
                            className="bg-primary h-10 rounded-xl bg-[var(--primary)] px-5 text-xs font-medium text-white transition hover:opacity-90"
                        >
                            ایجاد کد تخفیف
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

