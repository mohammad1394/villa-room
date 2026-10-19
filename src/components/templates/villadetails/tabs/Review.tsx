"use client"
import React, {useEffect, useState} from 'react';
import ReviewCard, {UserId} from "@/components/modules/ReviewCard/ReviewCard";
import {Star} from "lucide-react";
import ReviewForm from "@/components/templates/villadetails/tabs/Review/ReviewForm";
import review from "@/models/Review";

type Props = {
    rating: number,
    reviewCount: number,
    villaId: string,
}
export interface Review {
    _id: string
    userId: UserId
    rating: number
    comment: string
    createdAt: string
}

function Review({rating, reviewCount, villaId}: Props) {

    const [reviews , setReviews] = useState([]);

    useEffect(() => {
        const getReviews  = async () =>{
            const res = await fetch("/api/review?villaId=" + villaId);
            const data = await res.json();
            setReviews(data);
        }
        getReviews();
    } , [])



    return (
        <div className="space-y-6">

            {/* فرم ثبت نظر */}
            <ReviewForm villaId={villaId}/>

            {/* امتیاز کلی */}
            <div
                className="flex flex-col gap-4 rounded-xl bg-[#F8FAFB] p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-[13px] text-[#66727D]">
                        امتیاز مهمان‌ها
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[28px] font-bold text-[#172B3A]">
                            {rating}
                        </span>

                        <div className="flex text-[#F5B544]">
                            {new Array(5 - rating).fill(0).map((item , index) => (
                                <Star size={16} key={index}/>
                            ))}
                            {new Array(rating).fill(0).map(item => (
                                <Star size={16} fill="currentColor"/>
                            ))}
                        </div>
                    </div>

                    <p className="mt-1 text-[11px] text-[#8A949C]">
                        بر اساس {reviewCount} نظر
                    </p>
                </div>
            </div>


            <div>
                {
                    reviews.map((review : Review, index) => (
                        <ReviewCard {...review} key={review._id} />
                    ))
                }
            </div>

        </div>
    );
}

export default Review;