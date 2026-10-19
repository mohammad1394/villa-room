"use client";

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { VillaType } from "@/types/Villa";


interface EditVillaModalProps {
    isOpen: boolean;
    villa: VillaType | null;
    isLoading?: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<VillaType>) => void;
}

export default function EditVillaModal({
                                           isOpen,
                                           villa,
                                           isLoading = false,
                                           onClose,
                                            onSubmit,
                                       }: EditVillaModalProps) {
    const [form, setForm] = useState <VillaType>({
        _id: "",
        title: "",
        description: "",
        type: "forest",
        province: "Mazandaran",
        city: "",
        address: "",
        images: [],
        pricePerNight: 0,
        capacity: 1,
        bedrooms: 1,
        bathrooms: 1,
        amenities: [],
        rating: 0,
        isActive : true,
        reviewsCount: 0,
        createdAt: "",
        updatedAt: "",
    });

    const [amenitiesInput, setAmenitiesInput] = useState("");

    useEffect(() => {
        if (villa) {
            setForm(villa);
            setAmenitiesInput(villa.amenities.join("، "));
        }
    }, [villa]);

    if (!isOpen || !villa) return null;

    const updateField = <K extends keyof VillaType>(
        field: K,
        value: VillaType[K]
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const amenities = amenitiesInput
            .split("،")
            .map((item) => item.trim())
            .filter(Boolean);

        onSubmit({
            title: form.title,
            description: form.description,
            type: form.type,
            province: form.province,
            city: form.city,
            address: form.address,
            images: form.images,
            pricePerNight: form.pricePerNight,
            capacity: form.capacity,
            bedrooms: form.bedrooms,
            bathrooms: form.bathrooms,
            amenities,
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-8 backdrop-blur-sm">
            <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            ویرایش اطلاعات ویلا
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            اطلاعات ویلا را ویرایش و ذخیره کنید
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 p-6">
                        {/* اطلاعات اصلی */}
                        <section>
                            <h3 className="mb-4 text-sm font-bold text-gray-900">
                                اطلاعات اصلی
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {/* عنوان */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        عنوان ویلا
                                    </label>

                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) =>
                                            updateField(
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                        placeholder="مثلاً ویلا لوکس در متل قو"
                                    />
                                </div>

                                {/* نوع */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        نوع ویلا
                                    </label>

                                    <select
                                        value={form.type}
                                        onChange={(e) =>
                                            updateField(
                                                "type",
                                                e.target.value as VillaType["type"]
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        <option value="forest">
                                            جنگلی
                                        </option>

                                        <option value="beach">
                                            ساحلی
                                        </option>

                                        <option value="pool">
                                            استخردار
                                        </option>

                                        <option value="mountain">
                                            کوهستانی
                                        </option>
                                    </select>
                                </div>


                                {/* توضیحات */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        توضیحات
                                    </label>

                                    <textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            updateField(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows={4}
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                                        placeholder="توضیحات ویلا..."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* موقعیت مکانی */}
                        <section>
                            <h3 className="mb-4 text-sm font-bold text-gray-900">
                                موقعیت مکانی
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* استان */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        استان
                                    </label>

                                    <select
                                        value={form.province}
                                        onChange={(e) =>
                                            updateField(
                                                "province",
                                                e.target.value as VillaType["province"]
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        <option value="Mazandaran">
                                            مازندران
                                        </option>

                                        <option value="Gilan">
                                            گیلان
                                        </option>
                                    </select>
                                </div>

                                {/* شهر */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        شهر
                                    </label>

                                    <select
                                        value={form.province}
                                        onChange={(e) =>
                                            updateField(
                                                "province",
                                                e.target.value as VillaType["province"]
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                                    >
                                        <option value="Mazandaran">
                                            مازندران
                                        </option>

                                        <option value="Gilan">
                                            گیلان
                                        </option>
                                    </select>
                                </div>

                                {/* آدرس */}
                                <div className="md:col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        آدرس
                                    </label>

                                    <input
                                        type="text"
                                        value={form.address}
                                        onChange={(e) =>
                                            updateField(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                                        placeholder="آدرس کامل ویلا"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* ظرفیت و امکانات */}
                        <section>
                            <h3 className="mb-4 text-sm font-bold text-gray-900">
                                ظرفیت و امکانات
                            </h3>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                {/* ظرفیت */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        ظرفیت
                                    </label>

                                    <input
                                        type="number"
                                        min={1}
                                        value={form.capacity}
                                        onChange={(e) =>
                                            updateField(
                                                "capacity",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>

                                {/* اتاق */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        تعداد اتاق
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={form.bedrooms}
                                        onChange={(e) =>
                                            updateField(
                                                "bedrooms",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>

                                {/* حمام */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        تعداد حمام
                                    </label>

                                    <input
                                        type="number"
                                        min={0}
                                        value={form.bathrooms}
                                        onChange={(e) =>
                                            updateField(
                                                "bathrooms",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                                    />
                                </div>

                                {/* امکانات */}
                                <div className="md:col-span-3">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        امکانات
                                    </label>

                                    <input
                                        type="text"
                                        value={amenitiesInput}
                                        onChange={(e) =>
                                            setAmenitiesInput(e.target.value)
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                                        placeholder="استخر، وای‌فای، پارکینگ، باربیکیو"
                                    />

                                    <p className="mt-2 text-xs text-gray-400">
                                        امکانات را با «،» از یکدیگر جدا کنید.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* قیمت */}
                        <section>
                            <h3 className="mb-4 text-sm font-bold text-gray-900">
                                قیمت‌گذاری
                            </h3>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    قیمت هر شب
                                </label>

                                <div className="relative">
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.pricePerNight}
                                        onChange={(e) =>
                                            updateField(
                                                "pricePerNight",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-14 text-sm outline-none focus:border-primary"
                                    />

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                        تومان
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            انصراف
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition bg-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    در حال ذخیره...
                                </>
                            ) : (
                                "ذخیره تغییرات"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}