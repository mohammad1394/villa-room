"use client";

import {useState} from "react";
import {Ban, Check, UserRound, X} from "lucide-react";
import {UserType} from "@/types/User";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";

interface UnbanUserModalProps {
    user: UserType | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function UnbanUserModal({
                                           user,
                                           isOpen,
                                           onClose
                                       }: UnbanUserModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    if (!isOpen || !user) return null;

    const handleUnban = async () => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/admin/users/${user._id}`,
                {
                    method: "PUT",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showCustomToast(
                    "خطا",
                    result.message || "رفع مسدودی کاربر انجام نشد",
                    "x",
                    "error"
                );

                return;
            }

            showCustomToast(
                "موفق",
                "کاربر با موفقیت از مسدودی خارج شد",
                "check",
                "success"
            );

            onClose();

            router.refresh();

        } catch (error) {
            console.error("UNBAN USER ERROR:", error);

            showCustomToast(
                "خطا",
                "خطایی در ارتباط با سرور رخ داد",
                "x",
                "error"
            );

        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isLoading) return;

        onClose();
    };

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#EDF1F4] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9F8F2] text-[#159574]"
                        >
                            <Check size={20}/>
                        </div>

                        <div>
                            <h2 className="text-[16px] font-bold text-[#172B3A]">
                                رفع مسدودی کاربر
                            </h2>

                            <p className="mt-1 text-[11px] text-[#8B9AAA]">
                                تأیید فعال کردن مجدد حساب کاربر
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8B9AAA] transition hover:bg-[#F4F7F9] hover:text-[#172B3A] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={18}/>
                    </button>
                </div>

                {/* User */}
                <div className="mx-6 mt-5 flex items-center gap-3 rounded-xl border border-[#E8EEF3] bg-[#F8FAFC] p-4">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="h-11 w-11 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8EEF3] text-[#657A8B]"
                        >
                            <UserRound size={20}/>
                        </div>
                    )}

                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-[#253C4D]">
                            {user.fullName}
                        </p>

                        <p
                            dir="ltr"
                            className="mt-1 truncate text-right text-[10px] text-[#8B9AAA]"
                        >
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="rounded-xl border border-[#D9EEE7] bg-[#F3FBF7] px-4 py-4">
                        <div className="flex gap-3">
                            <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E0F5ED] text-[#159574]">
                                <Check size={16}/>
                            </div>

                            <div>
                                <p className="text-[12px] font-bold text-[#245746]">
                                    آیا از رفع مسدودی این کاربر مطمئن هستید؟
                                </p>

                                <p className="mt-1.5 text-[10px] leading-5 text-[#648579]">
                                    با تأیید این عملیات، حساب کاربر مجدداً فعال
                                    می‌شود و کاربر می‌تواند از امکانات حساب
                                    کاربری خود استفاده کند.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#EDF1F4] pt-5">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="h-10 rounded-lg border border-[#E1E8EE] px-5 text-[11px] font-semibold text-[#657A8B] transition hover:bg-[#F5F7F9] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            انصراف
                        </button>

                        <button
                            type="button"
                            onClick={handleUnban}
                            disabled={isLoading}
                            className="flex h-10 items-center gap-2 rounded-lg bg-[#159574] px-5 text-[11px] font-semibold text-white transition hover:bg-[#117D63] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Check size={14}/>

                            {isLoading
                                ? "در حال فعال کردن..."
                                : "تأیید رفع مسدودی"
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
