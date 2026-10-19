"use client";

import React from "react";
import {Swiper, SwiperSlide} from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import {Pagination} from "swiper/modules";
import VillaGridCard from "@/components/modules/villa/villacards/VillaGridCard";

type RelatedVilla = {
    _id: string;
    city: string;
    pricePerNight: number;
    rating: number;
    title: string;
};

type RelatedVillasProps = {
    relatedVillas: RelatedVilla[];
};

function RelatedVillas({relatedVillas}: RelatedVillasProps) {
    return (
        <div className="w-full">
            <Swiper
                spaceBetween={16}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="!pb-10"
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                    },
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                    1280: {
                        slidesPerView: 4,
                    },
                }}
            >
                {relatedVillas.map((villa) => (
                    <SwiperSlide key={villa._id}>
                        <VillaGridCard {...villa} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default RelatedVillas;