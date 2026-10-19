"use client";

import {
    AlertTriangle,
    Ban,
    CheckCircle2,
    Loader2,
    X,
} from "lucide-react";
import {useState} from "react";

type VillBanData = {
    reason: string;
    bannedUntil?: string | null;
};

interface BlockVillaModalProps {
    villaTitle: string;
    isBlocked: boolean;
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: (data: VillBanData) => void;
}

export default function BlockVillaModal({
                                            villaTitle,
                                            isBlocked,
                                            isOpen,
                                            isLoading = false,
                                            onClose,
                                            onConfirm,
                                        }: BlockVillaModalProps) {
    const [reason, setReason] = useState("");
    const [bannedUntil, setBannedUntil] = useState("");

    if (!isOpen) return null;

    const actionText = isBlocked ? "رفع مسدودی" : "مسدود کردن";

    const handleSubmit = () => {
        onConfirm({
            reason,
            bannedUntil: bannedUntil || null,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                isBlocked
                                    ? "bg-emerald-50"
                                    : "bg-orange-50"
                            }`}
                        >
                            {isBlocked ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500"/>
                            ) : (
                                <Ban className="h-5 w-5 text-orange-500"/>
                            )}
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                {actionText} ویلا
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                مدیریت وضعیت انتشار ویلا
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                        <X className="h-5 w-5"/>
                    </button>
                </div>

                <div className="px-6 py-6">

                    <div
                        className={`mb-5 flex items-start gap-3 rounded-xl p-4 ${
                            isBlocked
                                ? "border border-emerald-100 bg-emerald-50"
                                : "border border-orange-100 bg-orange-50"
                        }`}
                    >
                        <AlertTriangle
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                                isBlocked
                                    ? "text-emerald-500"
                                    : "text-orange-500"
                            }`}
                        />

                        <p
                            className={`text-sm leading-6 ${
                                isBlocked
                                    ? "text-emerald-700"
                                    : "text-orange-700"
                            }`}
                        >
                            آیا مطمئن هستید که می‌خواهید ویلا{" "}
                            <span className="font-bold">
                                «{villaTitle}»
                            </span>{" "}
                            را {actionText} کنید؟
                        </p>
                    </div>

                    {!isBlocked && (
                        <>
                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    علت مسدودی
                                </label>

                                <textarea
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(e.target.value)
                                    }
                                    placeholder="علت مسدود کردن ویلا را وارد کنید..."
                                    rows={4}
                                    disabled={isLoading}
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 transition outline-none placeholder:text-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    تاریخ پایان مسدودی
                                </label>

                                <input
                                    type="date"
                                    value={bannedUntil}
                                    onChange={(e) =>
                                        setBannedUntil(e.target.value)
                                    }
                                    disabled={isLoading}
                                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 transition outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50"
                                />

                                <p className="mt-2 text-xs text-gray-400">
                                    در صورت خالی گذاشتن، مسدودی دائمی خواهد بود.
                                </p>
                            </div>
                        </>
                    )}

                    <p className="mt-5 text-sm leading-6 text-gray-500">
                        {isBlocked
                            ? "پس از رفع مسدودی، ویلا مجدداً می‌تواند در سایت نمایش داده شود."
                            : "پس از مسدود کردن، ویلا از دسترس کاربران خارج شده و در سایت نمایش داده نمی‌شود."}
                    </p>
                </div>

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
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            isBlocked
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin"/>
                                در حال انجام...
                            </>
                        ) : (
                            <>
                                {isBlocked ? (
                                    <CheckCircle2 className="h-4 w-4"/>
                                ) : (
                                    <Ban className="h-4 w-4"/>
                                )}

                                {actionText}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

