import React from 'react';
import SeeAllBtn from "@/components/modules/layout/button/SeeAllBtn";
import Image from "next/image";
import PopularDestinationCard from "@/components/modules/PopularDestinationCard/PopularDestinationCard";

function PopularDestination() {
    const destinationData =[
        {
            imageurl : "/assets/public-destination/kelardasht.webp",
            title : "کلاردشت",
            villacount : "86"
        },
        {
            imageurl : "/assets/public-destination/noshahr.webp",
            title : "نوشهر",
            villacount : "36"
        },
        {
            imageurl : "/assets/public-destination/ramsar.webp",
            title : "رامسر",
            villacount : "22"
        },
        {
            imageurl : "/assets/public-destination/babolsar.webp",
            title : "بابلسر",
            villacount : "76"
        },
        {
            imageurl : "/assets/public-destination/motelgho.webp",
            title : "متل قو",
            villacount : "130"
        },
    ]


    return (
        <div className={"my-[80px]"}>
            {/* Header */}
            <div className="mb-[32px] flex items-center justify-between">

                <div className="text-right">
                    <h4 className="text-[20px] font-bold">
                        مقاصد محبوب
                    </h4>
                </div>

                <SeeAllBtn />

            </div>
            <div className={"mx-auto flex flex-col lg:flex-row gap-5"}>
                {
                    destinationData.map((item, index) => (
                        <PopularDestinationCard key={item.title} title = {item.title} image = {item.imageurl} villaCount = {item.villacount} />
                    ))
                }
            </div>
        </div>
    );
}

export default PopularDestination;