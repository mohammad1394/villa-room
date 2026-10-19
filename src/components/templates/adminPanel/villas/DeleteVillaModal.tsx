"use client";

import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface DeleteVillaModalProps {
    villaTitle: string;
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
}

export default function DeleteVillaModal({
                                             villaTitle,
                                             isOpen,
                                             isLoading = false,
                                             onClose,
                                         }: DeleteVillaModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                            <Trash2 className="h-5 w-5 text-red-500" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                حذف ویلا
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                حذف دائمی اطلاعات ویلا
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-6 py-6">
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                        <p className="text-sm leading-6 text-red-700">
                            آیا مطمئن هستید که می‌خواهید ویلا{" "}
                            <span className="font-bold">
                                «{villaTitle}»
                            </span>{" "}
                            را حذف کنید؟
                        </p>
                    </div>

                    <p className="text-sm leading-6 text-gray-500">
                        با حذف ویلا، اطلاعات آن از سیستم حذف خواهد شد و این
                        عملیات قابل بازگشت نیست.
                    </p>
                </div>

                <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        انصراف
                    </button>

                    <button
                        // onClick={onConfirm}
                        disabled={isLoading}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                در حال حذف...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                حذف ویلا
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}