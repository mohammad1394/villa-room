"use client";

import {useState} from "react";
import {CalendarDays, Percent, Tag, X} from "lucide-react";

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
    const [code, setCode] = useState("");
    const [villaId, setVillaId] = useState("");
    const [maxUse, setMaxUse] = useState("");
    const [expire, setExpire] = useState("");
    const [percent, setPercent] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        onSubmit({
            code: code.trim(),
            villaId,
            maxUse: Number(maxUse),
            expire,
            percent: Number(percent),
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
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 p-5">
                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                کد تخفیف
                            </label>

                            <div className="relative">
                                <Tag
                                    size={17}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) =>
                                        setCode(e.target.value)
                                    }
                                    placeholder="مثلاً VILLA20"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-primary focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                ویلا
                            </label>

                            <select
                                value={villaId}
                                onChange={(e) =>
                                    setVillaId(e.target.value)
                                }
                                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600 outline-none transition focus:border-primary focus:bg-white"
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
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-600">
                                    درصد تخفیف
                                </label>

                                <div className="relative">
                                    <Percent
                                        size={17}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={percent}
                                        onChange={(e) =>
                                            setPercent(e.target.value)
                                        }
                                        placeholder="مثلاً 20"
                                        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-primary focus:bg-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-600">
                                    حداکثر تعداد استفاده
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    value={maxUse}
                                    onChange={(e) =>
                                        setMaxUse(e.target.value)
                                    }
                                    placeholder="مثلاً 100"
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-primary focus:bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                تاریخ انقضا
                            </label>

                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="date"
                                    value={expire}
                                    onChange={(e) =>
                                        setExpire(e.target.value)
                                    }
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pr-10 pl-4 text-sm text-gray-700 outline-none transition focus:border-primary focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-10 rounded-xl border border-gray-200 bg-white px-5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            انصراف
                        </button>

                        <button
                            type="submit"
                            className="h-10 rounded-xl bg-primary px-5 bg-[var(--primary)] text-xs font-medium text-white transition hover:opacity-90"
                        >
                            ایجاد کد تخفیف
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

