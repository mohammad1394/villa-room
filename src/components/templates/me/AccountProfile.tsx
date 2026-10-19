"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Camera,
    CalendarDays,
    ChevronDown,
    CircleCheck,
    Heart,
    LockKeyhole,
    Mail,
    MapPin,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import PersonalInfo from "@/components/templates/me/PersonalInfo";
import ChangePassword from "@/components/templates/me/ChangePassword";
import IdentityVerification from "@/components/templates/me/IdentityVerification";


function AccountProfile() {
    const [activeTab, setActiveTab] = useState("personalInfo");
    return (
       <div className={" min-w-0  w-[100%]"}>
           <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">


               {/* Profile Sidebar */}
               <aside className="h-fit w-[100%]  rounded-[16px] border border-gray-200 bg-white p-6 shadow-sm">
                   <h2 className="text-center text-base font-bold text-[#17334d]">
                       پروفایل کاربری
                   </h2>

                   {/* Avatar */}
                   <div className="relative mx-auto mt-6 h-[110px] w-[110px]">
                       <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-100">
                           <Image
                               src="/assets/avatar.jpg"
                               alt="profile"
                               fill
                               className="object-cover"
                           />
                       </div>

                       <button
                           type="button"
                           className="absolute bottom-0 right-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border-4 border-white bg-[#e5a33a] text-white"
                       >
                           <Camera size={15} />
                       </button>
                   </div>

                   <div className="mt-4 text-center">
                       <h3 className="font-bold text-[#17334d]">
                           محمد عزیز
                       </h3>

                       <p className="mt-2 text-xs text-gray-400">
                           عضو ویلاروم از خرداد ۱۴۰۲
                       </p>
                   </div>

                   {/* Stats */}
                   <div className="mt-7 rounded-[12px] bg-[#f8f9fb] p-4">
                       <div className="grid grid-cols-2 gap-y-5">

                           <div>
                               <div className="flex items-center gap-2">
                                   <CircleCheck
                                       size={16}
                                       className="text-[#17334d]"
                                   />

                                   <span className="text-[11px] text-gray-400">
                                    وضعیت حساب
                                </span>
                               </div>

                               <span className="mt-2 inline-block text-xs font-semibold text-green-600">
                                فعال
                            </span>
                           </div>

                           <div>
                               <div className="flex items-center gap-2">
                                   <UserRound
                                       size={16}
                                       className="text-[#17334d]"
                                   />

                                   <span className="text-[11px] text-gray-400">
                                    نقش کاربری
                                </span>
                               </div>

                               <p className="mt-2 text-xs font-semibold text-[#17334d]">
                                   کاربر عادی
                               </p>
                           </div>

                           <div>
                               <div className="flex items-center gap-2">
                                   <CalendarDays
                                       size={16}
                                       className="text-[#17334d]"
                                   />

                                   <span className="text-[11px] text-gray-400">
                                    تعداد رزروها
                                </span>
                               </div>

                               <p className="mt-2 text-xs font-semibold text-[#17334d]">
                                   ۵ رزرو
                               </p>
                           </div>

                           <div>
                               <div className="flex items-center gap-2">
                                   <Heart
                                       size={16}
                                       className="text-[#17334d]"
                                   />

                                   <span className="text-[11px] text-gray-400">
                                    علاقه‌مندی‌ها
                                </span>
                               </div>

                               <p className="mt-2 text-xs font-semibold text-[#17334d]">
                                   ۱۲ ویلا
                               </p>
                           </div>

                           <div className="col-span-2 border-t border-gray-200 pt-4">
                               <div className="flex items-center gap-2">
                                   <Mail
                                       size={16}
                                       className="text-[#17334d]"
                                   />

                                   <span className="text-[11px] text-gray-400">
                                    آخرین ورود
                                </span>
                               </div>

                               <p className="mt-2 text-xs font-semibold text-[#17334d]">
                                   امروز، ساعت ۱۰:۲۳
                               </p>
                           </div>
                       </div>
                   </div>

                   <button
                       type="button"
                       className="mt-6 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] border border-red-200 text-sm font-medium text-red-500 transition hover:bg-red-50"
                   >
                       حذف حساب کاربری
                   </button>
               </aside>

               {/* Main Content */}
               <div className={'min-w-0 w-full '}>
                   {/* Tabs */}
                   <div className="mb-0 flex items-end gap-1 overflow-x-auto">
                       <button
                           type="button"
                           onClick={() => setActiveTab("personalInfo")}
                           className={`flex h-[50px] shrink-0 items-center gap-2 rounded-t-[12px] border border-b-0 border-gray-200 px-5 text-sm transition ${
                               activeTab === "personalInfo"
                                   ? "bg-white font-semibold text-[#17334d]"
                                   : "bg-[#f8f9fb] text-gray-400 hover:text-[#17334d]"
                           }`}
                       >
                           <UserRound size={17} />
                           اطلاعات حساب
                       </button>

                       <button
                           type="button"
                           onClick={() => setActiveTab("changePassword")}
                           className={`flex h-[50px] shrink-0 items-center gap-2 rounded-t-[12px] border border-b-0 border-gray-200 px-5 text-sm transition ${
                               activeTab === "changePassword"
                                   ? "bg-white font-semibold text-[#17334d]"
                                   : "bg-[#f8f9fb] text-gray-400 hover:text-[#17334d]"
                           }`}
                       >
                           <UserRound size={17} />
                          تغییر رمز عبور
                       </button>

                       <button
                           type="button"
                           onClick={() => setActiveTab("IdentityVerification")}
                           className={`flex h-[50px] shrink-0 items-center gap-2 rounded-t-[12px] border border-b-0 border-gray-200 px-5 text-sm transition ${
                               activeTab === "IdentityVerification"
                                   ? "bg-white font-semibold text-[#17334d]"
                                   : "bg-[#f8f9fb] text-gray-400 hover:text-[#17334d]"
                           }`}
                       >
                           <UserRound size={17} />
                          تایید هویت
                       </button>
                   </div>

                   {
                       activeTab === "personalInfo" && (
                           <PersonalInfo/>
                       )
                   }
                   {
                       activeTab === "changePassword" && (
                           <ChangePassword/>
                       )
                   }
                   {
                       activeTab === "IdentityVerification" && (
                           <IdentityVerification/>
                       )
                   }


               </div>


           </div>
       </div>
    );
}

export default AccountProfile;