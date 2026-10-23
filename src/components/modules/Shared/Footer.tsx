import React from "react";
import {
    Home, MessageCircle,
    Send,
} from "lucide-react";

function Footer() {
    return (
        <footer
            dir="rtl"
            className="
                w-full
                min-h-[320px]
                bg-[var(--primary)]
                px-5
                sm:px-8
                md:px-[5%]
                lg:px-[7%]
                pt-[45px]
                md:pt-[55px]
                pb-[25px]
                text-white
            "
        >
            <div
                className="
                    mx-auto
                    max-w-[1200px]

                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4

                    gap-10
                    md:gap-12
                    lg:gap-16
                "
            >

                {/* لوگو و درباره */}
                <div className="flex w-full flex-col gap-5">
                    <div className="flex items-center gap-3">
                        <Home
                            size={40}
                            className="sm:w-12 sm:h-12"
                            strokeWidth={1.5}
                        />

                        <span className="text-[26px] sm:text-[30px] font-bold">
                            ویلاروم
                        </span>
                    </div>

                    <p className="text-[13px] sm:text-[14px] leading-8 text-gray-200">
                        تمامی حقوق محفوظ است.
                    </p>
                </div>


                {/* راهنما */}
                <div className="flex flex-col gap-5">
                    <p className="text-[17px] sm:text-[18px] font-bold">
                        راهنما
                    </p>

                    <ul className="
                        flex
                        flex-col
                        gap-4
                        text-[13px]
                        sm:text-[14px]
                        font-medium
                        text-gray-200
                    ">
                        <li>راهنمای رزرو</li>
                        <li>نحوه پرداخت</li>
                        <li>استرداد و کنسلی</li>
                        <li>قوانین ویلاها</li>
                    </ul>
                </div>


                {/* لینک های مفید */}
                <div className="flex flex-col gap-5">
                    <p className="text-[17px] sm:text-[18px] font-bold">
                        لینک‌های مفید
                    </p>

                    <ul className="
                        flex
                        flex-col
                        gap-4
                        text-[13px]
                        sm:text-[14px]
                        font-medium
                        text-gray-200
                    ">
                        <li>درباره ما</li>
                        <li>تماس با ما</li>
                        <li>قوانین و مقررات</li>
                        <li>سؤالات متداول</li>
                    </ul>
                </div>


                {/* درباره ما */}
                <div className="flex w-full flex-col gap-5">
                    <p className="text-[17px] sm:text-[18px] font-bold">
                        درباره‌ی ما
                    </p>

                    <p className="
                        text-[13px]
                        sm:text-[14px]
                        leading-8
                        text-gray-200
                    ">
                        ویلاروم سامانه رزرو آنلاین ویلا در شمال کشور
                        با بهترین قیمت و پشتیبانی ۲۴ ساعته
                    </p>


                    {/* شبکه های اجتماعی */}
                    <div className="flex gap-3">

                        <div className="
                            flex
                            h-9
                            w-9
                            sm:h-10
                            sm:w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-white/10
                            "
                        >
                            <MessageCircle size={18}/>
                        </div>

                        <div className="
                             flex
                             h-9
                             w-9
                             sm:h-10
                             sm:w-10
                             items-center
                             justify-center
                             rounded-full
                             bg-white/10
                             "
                        >
                        <Send size={18} />
                    </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;