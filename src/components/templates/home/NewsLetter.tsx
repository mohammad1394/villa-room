import React from 'react';
import {Mail} from "lucide-react";

function NewsLetter() {
    return (
            <div className={"flex  justify-center items-center w-full mx-auto h-[220px] my-[80px] shadow-me rounded-xl"}>
                <div className={"w-[80%] flex items-center justify-between"}>
                    <div>
                        <h4 className={"my-[8px] text-[var(--text-primary)] font-bold text-[18px]"}>
                            از تخفیف ها و پیشنهادهای ویژه باخبر شو !!
                        </h4>
                        <p className={"text-[var(--text-secondary)] text-[15px]"}>
                            ایمیل خود را وارد کنید تا از جدیدترین تخفیف ها باخبر شوید
                        </p>
                        <form className="flex h-[45px] mt-4 gap-2">
                            <input
                                type="email"
                                placeholder="ایمیل شما"
                                className="w-[500px]
                                h-full
                                rounded-lg
                                border
                                border-gray-200
                                px-4
                                outline-none
                                focus:border-[var(--primary)]"
                            />

                            <button
                                type="submit"
                                className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] h-full px-3 rounded-lg text-white"
                            >
                                عضویت
                            </button>

                        </form>
                    </div>
                    <div
                        className="
                        flex h-[180px] w-[180px]
                        shrink-0
                        items-center justify-center
                        rounded-full
                        bg-[#f1f0fa]
                        ml-auto
                        mr-[50px]
                    "
                    >
                        <div
                            className="
                            flex h-[70px] w-[70px]
                            items-center justify-center
                            rounded-full
                            bg-[#e8e6f7]
                        "
                        >
                            <Mail
                                size={38}
                                strokeWidth={1.5}
                                className="text-[var(--primary)]"
                            />
                        </div>
                    </div>
                </div>

            </div>
    );
}

export default NewsLetter;