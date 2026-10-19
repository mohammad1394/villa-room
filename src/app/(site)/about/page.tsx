import Image from "next/image";
import Link from "next/link";
import {
    ShieldCheck,
    SearchCheck,
    Headphones,
    Heart,
    MapPin,
    ArrowLeft,
} from "lucide-react";

const values = [
    {
        number: "01",
        title: "انتخاب مطمئن",
        description:
            "اطلاعات کامل ویلا، تصاویر، امکانات و قوانین را در اختیار شما قرار می‌دهیم تا با خیال راحت انتخاب کنید.",
        icon: ShieldCheck,
    },
    {
        number: "02",
        title: "جستجوی ساده",
        description:
            "با فیلترها و جستجوی هوشمند، اقامتگاه مناسب را سریع‌تر و راحت‌تر پیدا کنید.",
        icon: SearchCheck,
    },
    {
        number: "03",
        title: "پشتیبانی همراه",
        description:
            "از زمان انتخاب ویلا تا پایان اقامت، تیم پشتیبانی ویلاروم در کنار شماست.",
        icon: Headphones,
    },
    {
        number: "04",
        title: "تجربه بهتر",
        description:
            "برای ما هر رزرو فقط یک تراکنش نیست؛ شروع یک تجربه خوب برای شماست.",
        icon: Heart,
    },
];

const destinations = [
    {
        title: "مازندران",
        villas: "۸۶ ویلا",
        image: "/images/about/mazandaran.jpg",
    },
    {
        title: "گیلان",
        villas: "۷۲ ویلا",
        image: "/images/about/gilan.jpg",
    },
    {
        title: "سوادکوه",
        villas: "۴۸ ویلا",
        image: "/images/about/savadkuh.jpg",
    },
];

function AboutVillaRoom() {
    return (
        <main
            dir="rtl"
            className="mx-auto w-full max-w-[1280px] px-5 py-6 pb-20 sm:px-8 lg:px-10"
        >
            {/* Hero */}

            <section className="relative overflow-hidden rounded-[20px]">
                <div className="relative h-[420px] sm:h-[480px] lg:h-[520px]">
                    <Image
                        src="/images/about/about-hero.jpg"
                        alt="ویلا روم"
                        fill
                        priority
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-l from-[#172B3A]/90 via-[#172B3A]/55 to-transparent" />

                    <div className="relative z-10 flex h-full items-center">
                        <div className="w-full max-w-[650px] px-7 sm:px-12 lg:px-16">
                            <div className="mb-5 flex items-center gap-2 text-[13px] font-bold text-white/80">
                                <span className="h-2 w-2 rounded-full bg-[#C79B58]" />
                                درباره ویلاروم
                            </div>

                            <h1 className="text-[32px] font-extrabold leading-[1.6] text-white sm:text-[42px] lg:text-[52px]">
                                جایی برای پیدا کردن
                                <br />

                                <span className="text-[#D7B477]">
                                    اقامتگاه مناسب هر سفر
                                </span>
                            </h1>

                            <p className="mt-5 max-w-[560px] text-[14px] leading-8 text-white/80 sm:text-[16px]">
                                هر سفر خوب، از انتخاب یک اقامتگاه خوب شروع
                                می‌شود. ویلاروم تلاش می‌کند پیدا کردن خانه‌ای
                                مناسب برای سفر را ساده‌تر، مطمئن‌تر و
                                لذت‌بخش‌تر کند.
                            </p>

                            <Link
                                href="/villas"
                                className="
                                    mt-7
                                    inline-flex
                                    h-[48px]
                                    items-center
                                    gap-2
                                    rounded-[10px]
                                    bg-white
                                    px-6
                                    text-[13px]
                                    font-bold
                                    text-[#203140]
                                    transition
                                    hover:bg-[#F5F7F8]
                                "
                            >
                                مشاهده ویلاها

                                <ArrowLeft size={17} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission */}

            <section className="mt-16 grid overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface-secondary)] md:grid-cols-[0.85fr_1.15fr]">
                <div className="flex flex-col justify-center border-b border-[var(--border)] p-8 sm:p-10 md:border-b-0 md:border-l md:p-14 lg:p-16">
                    <div className="mb-5 flex items-center gap-2 text-[13px] font-bold text-[var(--accent)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                        چرا ویلاروم؟
                    </div>

                    <h2 className="text-[28px] font-extrabold leading-[1.7] text-[var(--text-primary)] sm:text-[34px]">
                        ما فقط اقامتگاه
                        <br />
                        رزرو نمی‌کنیم.
                    </h2>
                </div>

                <div className="p-8 sm:p-10 md:p-14 lg:p-16">
                    <p className="text-[14px] leading-8 text-[var(--text-secondary)] sm:text-[16px]">
                        هدف ما این است که تجربه سفر، از همان لحظه‌ای که
                        کاربر به دنبال اقامتگاه می‌گردد تا زمانی که وارد
                        اقامتگاه می‌شود، ساده، شفاف و قابل اعتماد باشد.
                    </p>

                    <p className="mt-5 text-[14px] leading-8 text-[var(--text-secondary)] sm:text-[16px]">
                        ما مجموعه‌ای از ویلاها و اقامتگاه‌ها را کنار هم
                        آورده‌ایم تا بتوانید بر اساس موقعیت، امکانات،
                        تصاویر، قیمت و شرایط اقامت، انتخابی آگاهانه داشته
                        باشید.
                    </p>

                    <div className="mt-8 flex items-center gap-3 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--success)]/10 text-[var(--success)]">
                            <ShieldCheck size={20} />
                        </div>

                        <span className="text-[13px] font-semibold text-[var(--text-primary)] sm:text-[14px]">
                            تجربه‌ای ساده، شفاف و قابل اعتماد
                        </span>
                    </div>
                </div>
            </section>

            {/* Values */}

            <section className="mt-16">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-4 flex items-center gap-2 text-[13px] font-bold text-[var(--accent)]">
                            <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                            چیزی که برای ما مهم است
                        </div>

                        <h2 className="text-[28px] font-extrabold text-[var(--text-primary)] sm:text-[34px]">
                            تجربه سفر را بهتر می‌کنیم
                        </h2>
                    </div>

                    <p className="max-w-[430px] text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                        از انتخاب اقامتگاه تا پایان سفر، تلاش می‌کنیم
                        تجربه‌ای راحت‌تر و مطمئن‌تر برای شما بسازیم.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value) => {
                        const Icon = value.icon;

                        return (
                            <article
                                key={value.number}
                                className="
                                    group
                                    min-h-[245px]
                                    rounded-[16px]
                                    border
                                    border-[var(--border)]
                                    bg-[var(--surface)]
                                    p-6
                                    transition
                                    duration-200
                                    hover:-translate-y-1
                                    hover:border-[var(--accent)]/30
                                    hover:shadow-[var(--shadow-me)]
                                "
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold text-[var(--text-secondary)]/50">
                                        {value.number}
                                    </span>

                                    <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--surface-secondary)] text-[var(--accent)] transition group-hover:bg-[var(--accent)] group-hover:text-white">
                                        <Icon size={21} />
                                    </div>
                                </div>

                                <h3 className="mt-8 text-[17px] font-bold text-[var(--text-primary)]">
                                    {value.title}
                                </h3>

                                <p className="mt-3 text-[13px] leading-7 text-[var(--text-secondary)]">
                                    {value.description}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* Destinations */}

            <section className="mt-16">
                <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2 text-[13px] font-bold text-[var(--accent)]">
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                        مقصدهای محبوب
                    </div>

                    <h2 className="text-[28px] font-extrabold text-[var(--text-primary)] sm:text-[34px]">
                        هر مقصد، یک داستان
                    </h2>

                    <p className="mt-3 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                        جایی را انتخاب کنید که حال‌وهوای سفر شما را کامل می‌کند.
                    </p>
                </div>

                <div className="grid h-auto grid-cols-1 gap-4 sm:grid-cols-2 lg:h-[390px] lg:grid-cols-3">
                    {destinations.map((destination, index) => (
                        <Link
                            href="/villas"
                            key={destination.title}
                            className={`
                                group
                                relative
                                overflow-hidden
                                rounded-[16px]

                                ${
                                index === 0
                                    ? "lg:col-span-1"
                                    : ""
                            }
                            `}
                        >
                            <div className="relative h-[280px] lg:h-full">
                                <Image
                                    src={destination.image}
                                    alt={destination.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 right-0 left-0 p-6 text-white">
                                    <div className="flex items-center gap-2 text-[11px] text-white/80">
                                        <MapPin size={14} />
                                        مقصد محبوب
                                    </div>

                                    <h3 className="mt-2 text-[22px] font-bold">
                                        {destination.title}
                                    </h3>

                                    <span className="mt-1 block text-[12px] text-white/80">
                                        {destination.villas}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Stats */}

            <section className="mt-16 border-y border-[var(--border)] py-10">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    <div className="text-center">
                        <strong className="block text-[28px] font-extrabold text-[var(--primary)] sm:text-[34px]">
                            ۲۵۰۰+
                        </strong>

                        <span className="mt-2 block text-[12px] text-[var(--text-secondary)]">
                            اقامتگاه
                        </span>
                    </div>

                    <div className="text-center">
                        <strong className="block text-[28px] font-extrabold text-[var(--primary)] sm:text-[34px]">
                            ۱۵۰K+
                        </strong>

                        <span className="mt-2 block text-[12px] text-[var(--text-secondary)]">
                            رزرو موفق
                        </span>
                    </div>

                    <div className="text-center">
                        <strong className="block text-[28px] font-extrabold text-[var(--primary)] sm:text-[34px]">
                            ۵۰+
                        </strong>

                        <span className="mt-2 block text-[12px] text-[var(--text-secondary)]">
                            شهر و مقصد
                        </span>
                    </div>

                    <div className="text-center">
                        <strong className="block text-[28px] font-extrabold text-[var(--primary)] sm:text-[34px]">
                            ۲۴/۷
                        </strong>

                        <span className="mt-2 block text-[12px] text-[var(--text-secondary)]">
                            پشتیبانی
                        </span>
                    </div>
                </div>
            </section>

            {/* CTA */}

            <section className="relative mt-16 overflow-hidden rounded-[20px] bg-[var(--primary)] px-6 py-16 text-center sm:px-10 lg:py-20">
                <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/20 blur-3xl" />

                <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10">
                    <div className="mb-4 text-[13px] font-bold text-white/60">
                        سفر بعدی شما
                    </div>

                    <h2 className="text-[28px] font-extrabold leading-[1.7] text-white sm:text-[38px]">
                        شاید سفر بعدی شما
                        <br />
                        همین‌جا شروع شود.
                    </h2>

                    <p className="mx-auto mt-4 max-w-[500px] text-[13px] leading-7 text-white/60 sm:text-[14px]">
                        مقصد موردنظرتان را انتخاب کنید و اقامتگاه مناسب
                        سفرتان را پیدا کنید.
                    </p>

                    <Link
                        href="/villas"
                        className="
                            mt-7
                            inline-flex
                            h-[48px]
                            items-center
                            gap-2
                            rounded-[10px]
                            bg-white
                            px-7
                            text-[13px]
                            font-bold
                            text-[var(--primary)]
                            transition
                            hover:bg-[#F5F7F8]
                        "
                    >
                        کشف ویلاها
                        <ArrowLeft size={17} />
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default AboutVillaRoom;