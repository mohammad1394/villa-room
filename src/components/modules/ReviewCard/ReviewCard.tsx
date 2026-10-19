"use client"
import React from 'react';
import {Star} from "lucide-react";

export interface Review {
    _id: string
    userId: UserId
    rating: number
    comment: string
    createdAt: string
}

export interface UserId {
    fullName: string
    avatar: any
}

function ReviewCard({createdAt , rating , comment ,userId } : Review) {


    return (
        <div>

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8EFF2] text-[13px] font-semibold text-[#172B3A]">
                        {userId.avatar}
                    </div>

                    <div>
                        <p className="text-[13px] font-semibold text-[#172B3A]">
                            {userId.fullName}
                        </p>

                        <p className="mt-1 text-[10px] text-[#8A949C]">
                            {new Date(createdAt).toLocaleDateString("fa-IR")}
                        </p>
                    </div>

                </div>

                <div className="flex items-center gap-1 text-[#F5B544]">
                    <Star size={14} fill="currentColor"/>
                    <span className="text-[12px] font-semibold text-[#172B3A]">
                            {rating}
                        </span>
                </div>

            </div>

            <p className="mt-4 text-[12px] leading-7 text-[#66727D]">
                {comment}
            </p>

        </div>
    );
}

export default ReviewCard;