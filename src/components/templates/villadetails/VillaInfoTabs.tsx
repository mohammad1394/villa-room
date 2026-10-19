"use client"


import {useState} from "react";
import Amenities from "@/components/templates/villadetails/tabs/Amenities";
import Rules from "@/components/templates/villadetails/tabs/Rules";
import Review from "@/components/templates/villadetails/tabs/Review";

interface Villa {
    _id : string;
    bathrooms: number;
    description: string;
    amenities: string[];
    rating: number;
    capacity : number;
    reviewsCount : number;
    __v: number;
}

function VillaInfoTabs({ villaInfo  }: { villaInfo: Villa } ) {

    const [activeTab, setActiveTab] = useState("about");


    return (
        <div className="mt-8 w-full">

            <div className="flex justify-around border-b border-[#E1E5E8] pb-4">
                <button
                    onClick={() => setActiveTab("about")}
                    className={activeTab === "about" ? "border-b border-b-4 border-[var(--primary)] text-[18px] font-bold text-[#172B3A] sm:text-[20px]" : ""}
                >
                    درباره ویلا
                </button>

                <button
                    onClick={() => setActiveTab("facilities")}
                    className={activeTab === "facilities" ? "border-b border-b-4 border-[var(--primary)] text-[18px] font-bold text-[#172B3A] sm:text-[20px]" : ""}
                >
                    امکانات
                </button>

                <button
                    onClick={() => setActiveTab("rules")}
                    className={activeTab === "rules" ? "border-b border-b-4 border-[var(--primary)] text-[18px] font-bold text-[#172B3A] sm:text-[20px]" : ""}
                >
                    قوانین
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={activeTab === "comments" ? "border-b border-b-4 border-[var(--primary)] text-[18px] font-bold text-[#172B3A] sm:text-[20px]" : ""}
                >
                    نظرات[{villaInfo.reviewsCount}]
                </button>
            </div>

            <div className="mt-6">

                {/* درباره ویلا */}
                {activeTab === "about" && (
                    <p className="text-[13px] leading-8 text-[#66727D] sm:text-[14px]">
                        {villaInfo.description}
                    </p>
                )}

                {/* امکانات */}
                {activeTab === "facilities" && (
                    <Amenities amenities={villaInfo.amenities}/>
                )}

                {/* قوانین */}
                {activeTab === "rules" && (
                    <Rules capacity = {villaInfo.capacity}/>
                )}

                {/* نظرات */}
                {activeTab === "comments" && (
                    <Review
                        rating = {villaInfo.rating}
                        reviewCount = {villaInfo.reviewsCount}
                        villaId = {villaInfo._id}
                    />
                )}

            </div>
        </div>
    );
}

export default VillaInfoTabs;