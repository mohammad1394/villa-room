import {
    Phone,
    Mail,
    MapPin,
    Clock,
} from "lucide-react";

const methods = [
    {
        icon: Phone,
        title: "تماس تلفنی",
        text: "۰۹۱۲۳۴۵۶۷۸۹",
    },
    {
        icon: Mail,
        title: "ایمیل",
        text: "support@villaroom.ir",
    },
    {
        icon: Clock,
        title: "ساعات پاسخگویی",
        text: "شنبه تا پنجشنبه، ۹ تا ۱۸",
    },
    {
        icon: MapPin,
        title: "دفتر ویلاروم",
        text: "مازندران، ساری",
    },
];

export default function ContactMethods() {
    return (
        <section className="my-5 sm:my-7">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">

                {methods.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="
                                flex min-h-[65px]
                                items-center gap-2
                                rounded-[9px]
                                border border-gray-200
                                bg-white
                                px-2.5 py-2
                                sm:min-h-[75px]
                                sm:px-4
                            "
                        >
                            <div
                                className="
                                    flex h-[40px] w-[40px]
                                    shrink-0 items-center justify-center
                                    rounded-full
                                    bg-[var(--primary)]
                                "
                            >
                                <Icon
                                    size={16}
                                    className="text-white"
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-[10px] md:text-[14px] font-bold text-[var(--text-primary)] ">
                                    {item.title}
                                </h3>

                                <p className="text-[9px] mt-1 truncate lg:text-[12px] text-[var(--text-secondary)] ">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    );
                })}

            </div>
        </section>
    );
}