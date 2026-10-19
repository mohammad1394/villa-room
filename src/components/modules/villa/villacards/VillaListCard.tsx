import React from 'react';
import Image from "next/image";
import {Bath, BedDouble, Heart, Star, Users} from "lucide-react";
import Link from "next/link";
import {VillaType} from "@/types/Villa";


function VillaListCard({pricePerNight , title , city , bedrooms , bathrooms, capacity } : VillaType) {
    return (
        <div className={"w-full h-[400px] md:h-[210px]  bg-white flex flex-col md:flex-row gap-5 rounded-xl"}>
            <div className={"relative"}>
                <Image src={"/assets/herobg.jpg"} alt={""} width={400} height={400}
                       className={"h-full w-[250px] rounded-xl object-cover"}/>
                    <div
                        className="
                    flex
                    items-center
                    gap-1
                    absolute
                    left-1
                    bottom-2
                    z-10
                    bg-white
                    rounded-[6px]
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
                        4.6
                    </div>
            </div>
            <div className={"flex-1 flex flex-col p-5 justify-between"} data-aos="fade-up">
                {/*title */}
                <div className={" flex justify-between "}>
                    <div className={"flex flex-col gap-3"}>
                        <Link href={"/villas/1"} className={"text-[16px] font-bold cursor-pointer"}>
                            {title}
                        </Link>
                        <p className={"text-[13px] text-[var(--text-secondary)] )]"}>
                            {city}
                        </p>

                    </div>
                    <Heart size={20} className="cursor-pointer"/>
                </div>
                {/*feature*/}
                <div className="flex items-center gap-7 text-[15px] text-[#66727D] my-5">
                   <span className="flex items-center gap-1">
                       <Users size={15}/>
                       {capacity}
                   </span>

                    <span className="flex items-center gap-1">
                          <BedDouble size={15}/>
                        {bedrooms}
                           </span>
                    <span className="flex items-center gap-1">
                            <Bath size={15}/>
                        {bathrooms}
                    </span>
                </div>
                {/*price*/}
                <p className={"text-[15px] font-bold text-[#66727D] mt-[12px] text-left"}>
                    شب /
                    <span className={"text-[#22A06B]"}> {pricePerNight} تومان</span>
                </p>
            </div>
        </div>
    );
}

export default VillaListCard;