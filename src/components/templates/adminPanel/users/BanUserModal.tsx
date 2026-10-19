"use client";

import {useState} from "react";
import {Ban, UserRound, X} from "lucide-react";
import {UserType} from "@/types/User";
import {showCustomToast} from "@/components/modules/layout/toast/toast";
import {useRouter} from "next/navigation";

interface BanUserModalProps {
    user: UserType | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function BanUserModal({
                                         user,
                                         isOpen,
                                         onClose
                                     }: BanUserModalProps) {
    const [reason, setReason] = useState("");
    const [bannedUntil, setBannedUntil] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    if (!isOpen || !user) return null;

    const handleClick = async () => {
        if (isLoading) {
            showCustomToast(
                "خطا",
                "درخواست شما در حال پردازش است",
                "x",
                "error"
            );
            return;
        }

        if (!reason.trim()) {
            showCustomToast(
                "خطا",
                "لطفاً علت مسدودی را وارد کنید",
                "x",
                "error"
            );
            return;
        }

        setIsLoading(true);

        try {
            const data = {
                reason: reason.trim(),
                bannedUntil: bannedUntil || null
            };

            const response = await fetch(
                `/api/admin/users/${user._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showCustomToast(
                    "خطا",
                    result.message || "مسدود کردن کاربر انجام نشد",
                    "x",
                    "error"
                );

                return;
            }

            showCustomToast(
                "موفق",
                "کاربر با موفقیت مسدود شد",
                "check",
                "success"
            );

            setReason("");
            setBannedUntil("");

            onClose();

            router.refresh();

        } catch (error) {
            console.error("BAN USER ERROR:", error);

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

        setReason("");
        setBannedUntil("");

        onClose();
    };

    return (
        <div
            dir="rtl"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-[#EDF1F4] px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F0] text-[#EF5350]"
                        >
                            <Ban size={20}/>
                        </div>

                        <div>
                            <h2 className="text-[16px] font-bold text-[#172B3A]">
                                مسدود کردن کاربر
                            </h2>

                            <p className="mt-1 text-[11px] text-[#8B9AAA]">
                                اطلاعات مسدودی کاربر را وارد کنید
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

                <div className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-[12px] font-semibold text-[#53697A]">
                            علت مسدودی
                            <span className="mr-1 text-[#EF5350]">*</span>
                        </label>

                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            disabled={isLoading}
                            placeholder="دلیل مسدود کردن این کاربر را وارد کنید..."
                            className="w-full resize-none rounded-xl border border-[#E1E8EE] bg-white px-4 py-3 text-[12px] text-[#263D4F] transition outline-none placeholder:text-[#A7B3BE] focus:border-[#173B50] disabled:bg-[#F8FAFC]"
                        />

                        {!reason.trim() && reason.length > 0 && (
                            <p className="mt-1.5 text-[10px] text-[#EF5350]">
                                وارد کردن علت مسدودی الزامی است.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-[12px] font-semibold text-[#53697A]">
                            مسدودی تا تاریخ
                        </label>

                        <input
                            type="date"
                            value={bannedUntil}
                            onChange={(e) => setBannedUntil(e.target.value)}
                            disabled={isLoading}
                            className="h-11 w-full rounded-xl border border-[#E1E8EE] bg-white px-4 text-[12px] text-[#263D4F] transition outline-none focus:border-[#173B50] disabled:bg-[#F8FAFC]"
                        />

                        <p className="mt-1.5 text-[10px] text-[#9AA8B4]">
                            اگر تاریخ را وارد نکنید، مسدودی دائمی خواهد بود.
                        </p>
                    </div>

                    <div className="rounded-xl border border-[#F5DFDF] bg-[#FFF8F8] px-4 py-3">
                        <div className="flex gap-2">
                            <Ban
                                size={16}
                                className="mt-0.5 shrink-0 text-[#EF5350]"
                            />

                            <p className="text-[10px] leading-5 text-[#A65B5B]">
                                پس از مسدود کردن، کاربر امکان استفاده از حساب
                                کاربری خود را نخواهد داشت.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-[#EDF1F4] pt-5">
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
                            onClick={handleClick}
                            disabled={!reason.trim() || isLoading}
                            className="flex h-10 items-center gap-2 rounded-lg bg-[#EF5350] px-5 text-[11px] font-semibold text-white transition hover:bg-[#D94340] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Ban size={14}/>

                            {isLoading ? "در حال مسدود کردن..." : "مسدود کردن کاربر"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
