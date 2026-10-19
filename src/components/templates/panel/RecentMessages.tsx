import Image from "next/image";

const messages = [
    {
        title: "پشتیبانی ویلاروم",
        text: "رزرو شما برای ویلا جنگلی رویایی تایید شد.",
        time: "۵ ساعت پیش",
    },
    {
        title: "پشتیبانی ویلاروم",
        text: "یادآوری: تاریخ ورود شما فردا می‌باشد.",
        time: "۱ روز پیش",
    },
    {
        title: "مدیر ویلا ساحلی آرامش",
        text: "خوش آمدید. هر سوالی داشتید در خدمتیم.",
        time: "۲ روز پیش",
    },
];

export default function RecentMessages() {
    return (
        <section
            className="
                rounded-[14px]
                border border-gray-200
                bg-white
                p-4 sm:p-5
            "
        >
            <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-bold text-[#17334d]">
                    آخرین پیام‌ها
                </h2>

                <button className="text-[10px] text-blue-600">
                    مشاهده همه
                </button>
            </div>

            <div className="mt-5 space-y-3">
                {messages.map((message) => (
                    <div
                        key={message.title + message.time}
                        className="
                            flex items-center gap-3
                            rounded-[10px]
                            border border-gray-100
                            p-3
                        "
                    >
                        <Image
                            src="/assets/avatar.jpg"
                            alt=""
                            width={42}
                            height={42}
                            className="rounded-full"
                        />

                        <div className="min-w-0 flex-1">
                            <h3 className="text-[11px] font-bold text-[#17334d]">
                                {message.title}
                            </h3>

                            <p className="mt-1 truncate text-[9px] text-gray-500">
                                {message.text}
                            </p>
                        </div>

                        <span className="whitespace-nowrap text-[9px] text-gray-400">
                            {message.time}
                        </span>
                    </div>
                ))}
            </div>

            <button
                className="
                    mt-4 h-[40px] w-full
                    rounded-[8px]
                    border border-gray-200
                    text-[10px]
                    text-blue-600
                "
            >
                ← مشاهده همه پیام‌ها
            </button>
        </section>
    );
}