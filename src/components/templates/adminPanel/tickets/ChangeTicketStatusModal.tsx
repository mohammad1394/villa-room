"use client";

import { Loader2, X } from "lucide-react";
import { useState } from "react";
import {TicketStatus, TicketType} from "@/types/Ticket";


interface ChangeTicketStatusModalProps {
    ticketTitle: string;
    currentStatus: TicketStatus;
    isOpen: boolean;
    isLoading?: boolean;
    onClose: () => void;
    onConfirm: (status: TicketType["status"]) => void;
}

const statuses = [
    {
        value: "open",
        label: "باز",
    },
    {
        value: "pending",
        label: "در حال بررسی",
    },
    {
        value: "answered",
        label: "پاسخ داده شده",
    },
    {
        value: "closed",
        label: "بسته شده",
    },
] as const;

export default function ChangeTicketStatusModal({
                                                     ticketTitle,
                                                     currentStatus,
                                                     isOpen,
                                                     isLoading = false,
                                                     onClose,
                                                     onConfirm,
                                                 }: ChangeTicketStatusModalProps) {
    const [status, setStatus] =
        useState<TicketType["status"]>(currentStatus);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                dir="rtl"
                className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <h2 className="text-lg font-bold text-[#172B3A]">
                        تغییر وضعیت تیکت
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5 px-6 py-6">
                    <div>
                        <p className="mb-2 text-xs text-[#8B9AAA]">
                            عنوان تیکت
                        </p>

                        <p className="rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm font-semibold text-[#263D4F]">
                            {ticketTitle}
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-[#657A8B]">
                            وضعیت جدید
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value as TicketType["status"]
                                )
                            }
                            defaultValue={currentStatus}
                            disabled={isLoading}
                            className="h-11 w-full rounded-xl border border-[#E1E8EE] bg-white px-3 text-sm text-[#263D4F] outline-none focus:border-[#6F95AD]"
                        >
                            {statuses.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 rounded-xl border border-[#E1E8EE] px-4 py-2.5 text-sm font-medium text-[#657A8B] transition hover:bg-[#F8FAFC]"
                    >
                        انصراف
                    </button>

                    <button
                        type="button"
                        onClick={() => onConfirm(status)}
                        disabled={isLoading || status === currentStatus}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#173B50] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#214D66] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />
                                در حال ذخیره...
                            </>
                        ) : (
                            "ذخیره تغییرات"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}