import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import connectToDB from "@/config/db";
import { verifyAccessToken } from "@/utility/auth";
import UserModel from "@/models/User";
import Booking from "@/models/Booking";
import {BookingType} from "@/types/Booking";
import Villa from "@/models/Villa";




export default async function RecentBookings() {
    await connectToDB();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    void Villa;

    const tokenPayload = verifyAccessToken(token);

    if (!tokenPayload) {
        redirect("/login");
    }

    const user = await UserModel.findOne(
        {
            email: tokenPayload.email,
        },
        "_id"
    ).lean();

    if (!user) {
        redirect("/login");
    }

    const bookings : BookingType[] = await Booking.find({
        userId: user._id,
    })
        .populate(
            "villaId",
            "title images city province"
        )
        .sort({
            createdAt: -1,
        })
        .limit(3)
        .lean();


    return (
        <section className="rounded-[14px] border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-bold text-[#17334d]">
                    آخرین رزروها
                </h2>

                <Link
                    href="/panel/bookings"
                    className="text-[10px] text-blue-600"
                >
                    مشاهده همه
                </Link>
            </div>

            <div className="mt-5 space-y-3">
                {bookings.length === 0 ? (
                    <div className="rounded-[10px] border border-dashed border-gray-200 py-8 text-center">
                        <p className="text-[12px] text-gray-400">
                            هنوز رزروی ندارید
                        </p>
                    </div>
                ) : (
                    bookings.map((booking) => {
                        const villa = booking.villaId;

                        if (!villa) {
                            return null;
                        }

                        return (
                            <div
                                key={String(booking._id)}
                                className="flex items-center gap-3 rounded-[10px] border border-gray-100 p-3"
                            >
                                <Image
                                    src={
                                        villa.images?.[0] ||
                                        "/assets/default-villa.jpg"
                                    }
                                    alt={villa.title}
                                    width={80}
                                    height={65}
                                    className="h-[65px] w-[80px] rounded-[9px] object-cover"
                                />

                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-[12px] font-bold text-[#17334d]">
                                        {villa.title}
                                    </h3>

                                    <div className="mt-1 flex items-center gap-1 text-[9px] text-gray-400">
                                        <MapPin size={11} />

                                        <span>
                                            {villa.city}
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden text-center sm:block">
                                    <span className="rounded-full bg-green-50 px-3 py-1 text-[9px] text-green-600">
                                        {booking.status}
                                    </span>

                                    <p className="mt-2 text-[10px] font-medium">
                                        {booking.totalPrice?.toLocaleString(
                                            "fa-IR"
                                        )}{" "}
                                        تومان
                                    </p>
                                </div>

                                <div className="hidden text-[9px] text-gray-500 md:block">
                                    <p>
                                        ورود:{" "}
                                        {new Date(
                                            booking.checkIn
                                        ).toLocaleDateString("fa-IR")}
                                    </p>

                                    <p className="mt-1">
                                        خروج:{" "}
                                        {new Date(
                                            booking.checkOut
                                        ).toLocaleDateString("fa-IR")}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <Link
                href="/panel/bookings"
                className="mt-4 flex h-[40px] w-full items-center justify-center rounded-[8px] border border-gray-200 text-[10px] text-blue-600"
            >
                ← مشاهده همه رزروها
            </Link>
        </section>
    );
}