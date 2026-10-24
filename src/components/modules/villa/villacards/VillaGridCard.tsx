
import React from "react";
import Image from "next/image";
import { Heart, MapPin, Star } from "lucide-react";
import { showCustomToast } from "@/components/modules/layout/toast/toast";
import AddToWishList from "@/components/modules/villa/AddToWishList/AddToWishList";
import Link from "next/link";
import {VillaType} from "@/types/Villa";


function VillaGridCard({
                       _id,
                       rating,
                       title,
                       city,
                       pricePerNight,
                        images
                   }: VillaType) {





    return (
        <div
            className="
                flex
                h-[350px]
                w-full
                flex-col
                overflow-hidden
                rounded-[14px]
                bg-white
                shadow-me
            "
            data-aos="flip-left"
        >
            {/* Image */}
            <div className="relative h-[190px] w-full">

                <Link href={`/villas/${_id}`}>

                <Image
                    src={images[0]}
                    alt={"hello"}
                    fill
                    className="object-cover object-center"
                />
                </Link>

                {/* Favorite */}
                <AddToWishList villaId={_id.toString()} />

                {/* Rating */}
                <div
                    className="
                        absolute
                        bottom-[8px]
                        left-[8px]
                        z-10
                        flex
                        items-center
                        gap-1
                        rounded-[6px]
                        bg-white
                        px-[7px]
                        py-[3px]
                        text-[11px]
                        font-medium
                    "
                >
                    <Star
                        size={12}
                        fill="#F5B400"
                        className="text-[#F5B400]"
                    />

                    {rating}
                </div>
            </div>

            {/* Information */}
            <div
                className="
                    flex
                    flex-col
                    items-center
                    gap-[8px]
                    px-[12px]
                    pt-[16px]
                "
            >
                <Link href={`/villas/${_id}`} className="text-[16px] font-bold">
                    {title}
                </Link>

                <p
                    className="
                        flex
                        items-center
                        text-[13px]
                        text-[#66727D]
                    "
                >
                    <MapPin size={14} />
                    {city}
                </p>

                <p
                    className="
                        mt-[12px]
                        text-[15px]
                        font-bold
                        text-[#66727D]
                    "
                >
                    شب /
                    <span className="text-[#22A06B]">
                        {" "}
                        {pricePerNight}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default VillaGridCard;