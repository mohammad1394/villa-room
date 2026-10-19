import Image from "next/image";

export default function ContactHero() {
    return (
        <section className="mx-auto w-full max-w-[1280px] px-4 pt-4 sm:px-6 lg:px-8">
            <div className="relative h-[150px] overflow-hidden rounded-[14px] sm:h-[190px] md:h-[220px]">

                <Image
                    src="/assets/herobg.jpg"
                    alt="ارتباط با ما"
                    fill
                    priority
                    sizes="(max-width: 1280px) 100vw, 1280px"
                    className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/25" />

                <div className="relative z-10 flex h-full items-center justify-start px-5 sm:px-8 md:px-12">
                    <div className="max-w-[420px] text-right text-white">
                        <h1 className="text-[20px] font-bold sm:text-[26px] md:text-[30px]">
                            با ما در ارتباط باشید
                        </h1>

                        <p className="mt-2 text-[10px] leading-5 text-white/90 sm:text-[12px] sm:leading-6 md:text-[13px]">
                            سوالی دارید یا نیاز به راهنمایی دارید؟
                            تیم ویلاروم همیشه آماده پاسخگویی به شماست.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}