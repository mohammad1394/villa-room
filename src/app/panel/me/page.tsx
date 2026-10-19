"use client";

import React, { useState } from "react";

import {

} from "lucide-react";
import AccountProfile from "@/components/templates/me/AccountProfile";


export default async function page() {

    return (
        <div className="w-[95%] mx-auto my-10 ">
            {/* Title */}
            <div className="mb-7">
                <h1 className="text-xl font-bold text-[#17334d] sm:text-2xl">
                    اطلاعات حساب کاربری
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    اطلاعات شخصی و تنظیمات حساب کاربری خود را مدیریت کنید.
                </p>
            </div>

            <div className="">
                {/* Main Content */}
                <div className="min-w-0">


                    {/* Personal Information */}
                    <AccountProfile/>

                </div>
            </div>
        </div>
    );
}