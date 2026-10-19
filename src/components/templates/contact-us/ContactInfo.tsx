import {
    Phone,
    Mail,
    MapPin,
} from "lucide-react";

const contactItems = [
    {
        icon: Phone,
        title: "شماره تماس",
        value: "۰۹۱۲۳۴۵۶۷۸۹",
        description: "همه روزه از ساعت ۹ تا ۱۸",
    },
    {
        icon: Mail,
        title: "ایمیل",
        value: "support@villaroom.ir",
        description: "پاسخگویی در کمتر از ۲۴ ساعت",
    },
    {
        icon: Phone,
        title: "شبکه‌های اجتماعی",
        value: "@villaroom.ir",
        description: "ما را در اینستاگرام دنبال کنید",
    },
    {
        icon: MapPin,
        title: "آدرس دفتر",
        value: "مازندران، ساری",
        description: "دفتر مرکزی ویلاروم",
    },
];

export default function ContactInfo() {
    return (
        <div className="rounded-[10px] border border-gray-200 bg-gray-50 p-4 sm:p-5 md:p-6">

            <h2 className="text-[15px] font-bold text-[var(--text-primary)] sm:text-[17px]">
                در کنار شما هستیم
            </h2>

            <p className="mt-2 text-[10px] leading-5 text-[var(--text-secondary)] sm:text-[11px]">
                اگر سوالی دارید یا برای رزرو ویلا به راهنمایی نیاز دارید،
                از طریق راه‌های ارتباطی زیر با ما در تماس باشید.
            </p>

            <div className="mt-5 space-y-4 ">
                {contactItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={index}
                            className="flex items-center justify-end gap-3 mt-10 "
                        >
                            <div className="min-w-0 flex flex-col gap-1 items-end">
                                <p className="text-[14px] font-bold text-[var(--text-primary)] sm:text-[11px]">
                                    {item.title}
                                </p>

                                <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                                    {item.value}
                                </p>

                                <p className="text-[12px] text-gray-400">
                                    {item.description}
                                </p>
                            </div>

                            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                                <Icon
                                    size={16}
                                    className="text-[var(--primary)]"
                                />
                            </div>


                        </div>
                    );
                })}
            </div>
        </div>
    );
}