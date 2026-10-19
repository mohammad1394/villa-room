"use client";

import { X } from "lucide-react";
import {UserType} from "@/types/User";

interface UserInfoModalProps {
    user: UserType | null;
    isOpen: boolean;
    onClose: () => void;
}

 function UserInfoModal({
                                          user,
                                          isOpen,
                                          onClose,
                                      }: UserInfoModalProps) {
    if (!isOpen || !user) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div
                className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            اطلاعات کاربر
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            اطلاعات حساب کاربری را مشاهده کنید
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            نام
                        </label>

                        <input
                            type="text"
                            value={user.fullName}
                            readOnly
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            ایمیل
                        </label>

                        <input
                            type="email"
                            value={user.email}
                            readOnly
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            شماره تلفن
                        </label>

                        <input
                            type="text"
                            value={user.phone}
                            readOnly
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            نقش کاربر
                        </label>

                        <select
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none"
                        >
                            <option value="Admin">
                                مدیر
                            </option>
                            <option value="User">
                                کاربر
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            وضعیت حساب
                        </label>

                        <select
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none"
                        >
                            <option value="active">
                                فعال
                            </option>
                            <option value="disable">
                                غیر فعال
                            </option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            تاریخ عضویت
                        </label>

                        <input
                            type="text"
                            value={new Date(user.createdAt).toLocaleDateString(
                                "fa-IR"
                            )}
                            readOnly
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-100 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[var(--bg-secondary)] px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] transition hover:bg-gray-200 border border-[var(--border)] "
                    >
                        بستن
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 mr-3"
                    >
                        ذخیره
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserInfoModal;