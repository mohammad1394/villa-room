import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";

export default function DashboardVillaCard() {
    return (
        <div
            className="
                relative
                min-h-[245px]
                overflow-hidden
                rounded-[14px]
                bg-[#0b2945]
            "
        >
            <Image
                src="/assets/villa.jpg"
                alt="villa"
                fill
                className="object-cover"
            />

            <div
                className="
                    absolute inset-0
                    bg-gradient-to-l
                    from-[#06213b]/95
                    via-[#06213b]/65
                    to-transparent
                "
            />

            <div
                className="
                    relative z-10
                    flex h-full
                    min-h-[245px]
                    flex-col justify-between
                    p-6
                    text-white
                "
            >
                <div>
                    <p className="text-[11px] text-gray-200">
                        رزرو بعدی شما
                    </p>

                    <h2 className="mt-4 text-[21px] font-bold">
                        ویلا ساحلی آرامش
                    </h2>

                    <div className="mt-2 flex items-center gap-1 text-[11px]">
                        <span>متل قو، مازندران</span>
                        <MapPin size={14} />
                    </div>
                </div>

                <div>
                    <div className="mb-4 h-px bg-white/30" />

                    <div className="grid grid-cols-2">
                        <div>
                            <p className="text-[10px] text-gray-300">
                                تاریخ ورود
                            </p>

                            <p className="mt-2 text-[11px]">
                                پنجشنبه ۲۳ خرداد
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] text-gray-300">
                                تاریخ خروج
                            </p>

                            <p className="mt-2 text-[11px]">
                                شنبه ۲۵ خرداد
                            </p>
                        </div>
                    </div>

                    <button
                        className="
                            mt-5
                            flex h-[40px]
                            items-center justify-center
                            rounded-[8px]
                            bg-white
                            px-5
                            text-[11px]
                            font-medium
                            text-[#17334d]
                        "
                    >
                        مشاهده جزئیات رزرو
                    </button>
                </div>
            </div>
        </div>
    );
}