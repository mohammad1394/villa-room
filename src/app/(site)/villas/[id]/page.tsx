import Image from "next/image";
import mongoose from "mongoose";
import Gallery from "@/components/templates/villadetails/Gallery";
import BookingCard from "@/components/templates/villadetails/BookingCard";
import VillaInfoTabs from "@/components/templates/villadetails/VillaInfoTabs";
import {Bath, BedDouble, MapPin, Star, Users, Wifi} from "lucide-react";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import React from "react";
import {notFound} from "next/navigation";
import RelatedVillas from "@/components/templates/villadetails/RelatedVillas";
import {VillaType} from "@/types/Villa";

async function Page({params}: { params: Promise<{ id: string }> }) {

    await connectToDB();
    const {id} = await params;



    if (!mongoose.isValidObjectId(id)) {
        return notFound();
    }

    const villa = await Villa.findOne({_id: id} , "-__v").lean();

    if (!villa) {
        return notFound();
    }

    const villaInfo : VillaType = {
        ...villa,
        _id: villa._id.toString(),
    };

    const relatedVillas = await Villa.find(
        {
            city: villaInfo.city,
            _id: {$ne: villaInfo._id},
            isActive: true,
        },
        "_id title city pricePerNight rating images"
    )
        .limit(8)
        .lean();

    return (
        <div className="mx-auto mt-10 mb-20 w-[90%] max-w-[1400px]">

            {/*Hero*/}
            <div
                className="relative h-auto min-h-[420px] w-full overflow-visible lg:h-[500px]"
            >

                <div
                    className="relative h-[300px] w-full overflow-hidden rounded-2xl sm:h-[380px] lg:absolute lg:top-0 lg:left-0 lg:h-full lg:w-[75%]"
                >
                    <Image
                        src= {villaInfo?.images[0]}
                        alt="ویلا لوکس در متل قو"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>


                <div
                    className="relative z-10 mt-[-30px] flex min-h-[280px] w-full flex-col rounded-[20px] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:p-7 lg:absolute lg:top-10 lg:right-5 lg:mt-0 lg:h-[80%] lg:w-[28%]"
                >

                    <div>
                        <h2
                            className="text-[22px] leading-8 font-bold text-[#172B3A] sm:text-[27px] sm:leading-[38px]"
                        >
                            {villaInfo.title}
                        </h2>


                        <div className="mt-3 flex items-center gap-2">
                           <span className="flex items-center text-[13px] font-semibold text-[#172B3A]">
                                  {villaInfo.rating}
                               {new Array(5 - villaInfo.rating).fill(0).map((_, index) => (
                                   <Star
                                       key={`empty-${index}`}
                                       size={16}
                                   />
                               ))}

                               {new Array(villaInfo.rating).fill(0).map((_, index) => (
                                   <Star
                                       key={`filled-${index}`}
                                       size={16}
                                       fill="currentColor"
                                   />
                               ))}
                           </span>
                            <span className="text-[12px] text-[#8A949C]">
                                ({villaInfo.reviewsCount} نظر)
                            </span>
                        </div>
                    </div>


                    <div className="mt-5 flex items-center gap-2 text-[#66727D]">
                        <MapPin size={17} className="shrink-0"/>

                        <span className="text-[12px] sm:text-[13px]">
                            {villaInfo.address}
                        </span>
                    </div>


                    <div className="my-6 h-px w-full bg-[#E8ECEF]"/>


                    <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-2">

                        {/* مهمان */}
                        <div className="flex flex-col items-center gap-2">
                            <Users
                                size={21}
                                strokeWidth={1.8}
                                className="text-[#213746]"
                            />

                            <span className="text-[11px] text-[#8A949C]">
                                ظرفیت
                            </span>

                            <span className="text-[13px] font-semibold text-[#172B3A]">
                              {villaInfo.capacity}
                            </span>
                        </div>

                        {/* اتاق */}
                        <div className="flex flex-col items-center gap-2">
                            <BedDouble
                                size={21}
                                strokeWidth={1.8}
                                className="text-[#213746]"
                            />

                            <span className="text-[11px] text-[#8A949C]">
                                اتاق
                            </span>

                            <span className="text-[13px] font-semibold text-[#172B3A]">
                                {villaInfo.bedrooms}
                            </span>
                        </div>

                        {/* حمام */}
                        <div className="flex flex-col items-center gap-2">
                            <Bath
                                size={21}
                                strokeWidth={1.8}
                                className="text-[#213746]"
                            />

                            <span className="text-[11px] text-[#8A949C]">
                                حمام
                            </span>

                            <span className="text-[13px] font-semibold text-[#172B3A]">
                               {villaInfo.bathrooms}
                            </span>
                        </div>

                        {/* اینترنت */}
                        <div className="flex flex-col items-center gap-2">
                            <Wifi
                                size={21}
                                strokeWidth={1.8}
                                className="text-[#213746]"
                            />

                            <span className="text-[11px] text-[#8A949C]">
                                اینترنت
                            </span>

                            <span className="text-[13px] font-semibold text-[#172B3A]">
                                دارد
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/*Gallery + Booking*/}
            <div className="my-8 flex flex-col gap-8 lg:flex-row">

                {/*Gallery*/}
                <div className="w-full lg:w-[70%]">
                    <Gallery images = {villaInfo.images}/>
                    <VillaInfoTabs villaInfo={villaInfo}/>
                </div>


                {/*my-bookings*/}
                <BookingCard/>

            </div>



            <div className={"flex  flex-col gap-5 w-full py-10 "}>
                <h2>ویلا های دیگر در{villaInfo.city}</h2>
                <RelatedVillas relatedVillas={relatedVillas}/>
            </div>

        </div>
    );
}

export default Page;