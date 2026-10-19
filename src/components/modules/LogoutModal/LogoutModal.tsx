"use client";

import {LogOut, X} from "lucide-react";

type LogoutModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
};

export default function LogoutModal({
                                        isOpen,
                                        onClose,
                                        isLoading,
                                        onConfirm
                                    }: LogoutModalProps) {
    if (!isOpen) return null;


    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[430px] rounded-[20px] bg-white p-5 shadow-xl sm:p-7"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div
                        className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-red-50 text-red-500">
                        <LogOut size={24}/>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-[36px] w-[36px] items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-[#17334d]"
                    >
                        <X size={20}/>
                    </button>
                </div>

                {/* Content */}
                <div className="mt-6">
                    <h2 className="text-lg font-bold text-[#17334d]">
                        خروج از حساب کاربری
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-gray-400">
                        آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
                        برای استفاده مجدد از امکانات حساب، باید دوباره وارد شوید.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-[48px] flex-1 items-center justify-center rounded-[10px] border border-gray-200 text-sm font-medium text-[#566575] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        انصراف
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex h-[48px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-red-500 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogOut size={17}/>

                        {isLoading ? "در حال خروج..." : "بله، خارج شو"}
                    </button>
                </div>
            </div>
        </div>
    );
}