"use client";

import { useState } from "react";
import {
    AlertCircle,
    Eye,
    EyeOff,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("لطفاً تمام فیلدها را تکمیل کنید.");
            return;
        }

        if (newPassword.length < 8) {
            setError("رمز عبور جدید باید حداقل ۸ کاراکتر باشد.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("رمز عبور جدید و تکرار آن یکسان نیستند.");
            return;
        }
    };

    return (
        <section className="rounded-[16px] border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            {/* Header */}
            <div className="mb-7 flex items-start gap-3">
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-[#f2f5f7] text-[#17334d]">
                    <LockKeyhole size={20} />
                </div>

                <div>
                    <h2 className="text-base font-bold text-[#17334d]">
                        تغییر رمز عبور
                    </h2>

                    <p className="mt-2 text-xs leading-6 text-gray-400">
                        برای افزایش امنیت حساب کاربری، یک رمز عبور قوی
                        انتخاب کنید.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5">

                    {/* Current Password */}
                    <div>
                        <label className="mb-2 block text-xs text-[#566575]">
                            رمز عبور فعلی
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={17}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={
                                    showCurrentPassword
                                        ? "text"
                                        : "password"
                                }
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="رمز عبور فعلی خود را وارد کنید"
                                className="h-[50px] w-full rounded-[10px] border border-gray-200 bg-white px-11 pl-12 text-sm text-[#17334d] outline-none transition placeholder:text-gray-300 focus:border-[#d9a13b]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrentPassword(
                                        !showCurrentPassword
                                    )
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#17334d]"
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="mb-2 block text-xs text-[#566575]">
                            رمز عبور جدید
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={17}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="رمز عبور جدید را وارد کنید"
                                className="h-[50px] w-full rounded-[10px] border border-gray-200 bg-white px-11 pl-12 text-sm text-[#17334d] outline-none transition placeholder:text-gray-300 focus:border-[#d9a13b]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#17334d]"
                            >
                                {showNewPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="mb-2 block text-xs text-[#566575]">
                            تکرار رمز عبور جدید
                        </label>

                        <div className="relative">
                            <ShieldCheck
                                size={17}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="رمز عبور جدید را دوباره وارد کنید"
                                className="h-[50px] w-full rounded-[10px] border border-gray-200 bg-white px-11 pl-12 text-sm text-[#17334d] outline-none transition placeholder:text-gray-300 focus:border-[#d9a13b]"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-[#17334d]"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Password Info */}
                <div className="mt-5 flex gap-3 rounded-[10px] border border-[#e5edf2] bg-[#f8fafb] p-4">
                    <AlertCircle
                        size={18}
                        className="mt-[2px] shrink-0 text-[#17334d]"
                    />

                    <div>
                        <h3 className="text-xs font-semibold text-[#17334d]">
                            نکات انتخاب رمز عبور
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-gray-400">
                            رمز عبور باید حداقل ۸ کاراکتر داشته باشد و
                            بهتر است شامل حروف بزرگ، حروف کوچک، اعداد و
                            کاراکترهای خاص باشد.
                        </p>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-[10px] border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-500">
                        {error}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="mt-7 flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#17334d] px-8 text-sm font-medium text-white transition hover:bg-[#0c2438] sm:w-[200px]"
                >
                    تغییر رمز عبور
                </button>
            </form>
        </section>
    );
}