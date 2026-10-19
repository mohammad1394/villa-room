import Image from "next/image";
import Link from "next/link";

export default function ContactCTA() {
    return (
        <section className="my-6 sm:my-8 md:my-10">
            <div
                className="
                    relative flex min-h-[100px] w-full
                    items-center overflow-hidden
                    rounded-[12px]
                    sm:min-h-[120px]
                    md:min-h-[140px]
                "
            >
                <Image
                    src="/assets/herobg.jpg"
                    alt="رزرو ویلا"
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div
                    className="
                        relative z-10 flex w-full
                        items-center justify-between
                        gap-4 px-4
                        sm:px-7
                        md:px-10
                    "
                >
                    {/* Text */}
                    <div className="text-right text-white">
                        <h3 className="text-[12px] font-bold sm:text-[15px] md:text-[17px]">
                            هنوز ویلای مناسبت رو پیدا نکردی؟
                        </h3>

                        <p className="mt-1 text-[8px] leading-5 text-white/90 sm:text-[10px] md:text-[11px]">
                            ویلاهای متنوع ویلاروم را ببین و اقامت بعدی خودت را
                            همین حالا رزرو کن.
                        </p>
                    </div>

                    {/* Button */}
                    <Link
                        href="/villas"
                        className="
                            flex h-[34px] w-[105px]
                            shrink-0 items-center justify-center
                            rounded-[6px]
                            bg-[var(--primary)]
                            text-[9px] font-medium text-white
                            transition-all
                            hover:bg-[var(--primary-hover)]
                            hover:shadow-md
                            sm:h-[40px] sm:w-[125px] sm:text-[10px]
                            md:h-[44px] md:w-[145px] md:text-[11px]
                        "
                    >
                        مشاهده ویلاها
                    </Link>
                </div>
            </div>
        </section>
    );
}