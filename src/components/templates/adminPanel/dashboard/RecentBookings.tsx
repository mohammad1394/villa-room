import {ArrowLeft, MoreHorizontal} from "lucide-react";
import React from "react";
import {BookingType} from "@/types/Booking";

export default function RecentBookings({bookings} : {bookings : BookingType[]}) {




    return (
        <div
            className="
                rounded-[12px]
                border
                border-[#e8edf2]
                bg-white
                p-5
            "
        >
            <div className="mb-5 flex items-center justify-between">

                <h3 className="text-[16px] font-bold text-[#17243a]">
                    آخرین رزروها
                </h3>


                <button
                    className="
                flex
                h-[34px]
                items-center
                gap-2
                rounded-[8px]
                border
                border-[#e0e6ed]
                px-4
                text-[11px]
                text-[#3974d8]
            "
                >
                    مشاهده همه رزروها
                    <ArrowLeft size={14} />
                </button>

            </div>

            <div className="overflow-x-auto">
                <table
                    dir="rtl"
                    className="w-full min-w-[850px] text-right"
                >
                    <thead>
                    <tr className="rounded-[10px] bg-[#fafbfc] text-[12px] text-[#536174]">
                        <th className="px-4 py-4">
                            کد رزرو
                        </th>

                        <th className="px-4 py-4">
                            کاربر
                        </th>

                        <th className="px-4 py-4">
                            ویلا
                        </th>

                        <th className="px-4 py-4">
                            تاریخ خروج
                        </th>

                        <th className="px-4 py-4">
                            مبلغ
                        </th>

                        <th className="px-4 py-4">
                            وضعیت
                        </th>

                        <th className="px-4 py-4">
                            عملیات
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {bookings.map((booking , index) => (
                        <tr
                            key={booking._id}
                            className="border-b border-[#edf1f4] text-[12px] text-[#26364c] last:border-none"
                        >
                            <td className="px-4 py-4">
                                {index + 1}
                            </td>

                            <td className="px-4 py-4">
                                {booking.userId.fullName}
                            </td>

                            <td className="px-4 py-4">
                                {booking.villaId.title}
                            </td>

                            <td className="px-4 py-4">
                                {new Date(booking.checkOut).toLocaleDateString("fa-IR")}
                            </td>

                            <td className="px-4 py-4">
                                {(booking.totalPrice).toLocaleString("fa-IR") } تومان
                            </td>

                            <td className="px-4 py-4">
                                    <span
                                        className={`
                                            inline-flex
                                            rounded-full
                                            px-3
                                            py-1.5
                                            text-[10px]
                                            ${
                                            booking.status ===
                                            "completed" || "confirm"
                                                ? "bg-[#eaf8f0] text-[#24945d] "
                                                : booking.status ===
                                                "pending"
                                                    ? "bg-[#fff5e6] text-[#ed991f]"
                                                    : "bg-[#ffeded] text-red-500"
                                        }
                                        `}
                                    >
                                        {booking.status}
                                    </span>
                            </td>

                            <td className="px-4 py-4">
                                <button
                                    className="
                                            flex
                                            h-[34px]
                                            w-[42px]
                                            items-center
                                            justify-center
                                            rounded-[8px]
                                            border
                                            border-[#e4e9ee]
                                            bg-white
                                        "
                                >
                                    <MoreHorizontal size={17} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}