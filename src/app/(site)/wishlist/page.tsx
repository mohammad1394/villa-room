import {verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";
import Favorite from "@/models/Favorite";
import "@/models/Villa";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import Container from "@/components/modules/layout/container/Container";
import Link from "next/link";
import {WishlistItem} from "@/types/WishList";
import VillaContent from "@/components/modules/villa/VillaContent/VillaContent";
import {getCurrentUser} from "@/utility/getCurrentUser";

async function FavoriteVillasPage() {
    const user = await getCurrentUser();

    const wishlist : WishlistItem[] = await Favorite
        .find({ userId: user._id })
        .populate("villaId")
        .lean();

    const villas = wishlist
        .map((item) => item.villaId)
        .filter(Boolean)
        .map((villa) => ({
            ...villa,
            _id: villa._id.toString(),
        }));


    return (
        <div>
            <div className={"w-full h-[250px] "}>
                <Image src={"/assets/favorite-hero.png"} alt={"favorite-hero"} width={1000} height={1000} className={"w-full h-full"}/>

            </div>
            <Container>



                {/*villa Cards*/}
                <VillaContent villas={villas}/>


                {/*CTA Banner*/}

                <section className="my-6 w-full sm:my-8 md:my-10">
                    <div
                        className="
            relative mx-auto flex w-full items-center
            overflow-hidden rounded-[14px] border border-gray-200
            bg-[#fafafa]
            px-4 py-5
            sm:min-h-[110px] sm:px-6 sm:py-4
            md:min-h-[140px] md:px-10
        "
                    >
                        {/* Background */}
                        <Image
                            src="/assets/favoriteCTA.png"
                            alt="مشاهده ویلاهای بیشتر"
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-center"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-white/20" />

                        {/* Content */}
                        <div
                            className="
                relative z-10 flex w-full
                flex-col items-center justify-center gap-4
                sm:flex-row sm:items-center sm:justify-between
                sm:gap-6
            "
                        >
                            {/* Text - Right */}
                            <div className="min-w-0 text-center sm:text-right">
                                <h3
                                    className="
                        text-[13px] font-bold leading-6
                        text-[var(--text-primary)]
                        sm:text-[15px] sm:leading-7
                        md:text-[17px]
                    "
                                >
                                    هنوز ویلای مناسب خودت رو پیدا نکردی؟
                                </h3>

                                <p
                                    className="
                        mt-1 text-[10px] leading-5
                        text-[var(--text-secondary)]
                        sm:text-[12px] sm:leading-6
                        md:text-[13px]
                    "
                                >
                                    بین صدها ویلای زیبا جستجو کن و اقامتگاه مورد علاقه‌ات رو پیدا کن.
                                </p>
                            </div>

                            {/* Button - Left */}
                            <Link
                                href="/villas"
                                className="
                    flex h-[36px] w-[130px] shrink-0
                    items-center justify-center
                    rounded-[7px]
                    bg-[var(--primary)]
                    px-3
                    text-[10px] font-medium text-white
                    transition-all duration-200
                    hover:bg-[var(--primary-hover)]
                    hover:shadow-md
                    sm:h-[42px] sm:w-[150px] sm:text-[12px]
                    md:h-[48px] md:w-[180px] md:text-[13px]
                "
                            >
                                مشاهده ویلاهای بیشتر
                            </Link>
                        </div>
                    </div>
                </section>



            </Container>
        </div>
    );
}

export default FavoriteVillasPage;
