import {
    CalendarDays,
    Heart,
    WalletCards,
    Star,
} from "lucide-react";

import connectToDB from "@/config/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAccessToken } from "@/utility/auth";

import UserModel from "@/models/User";
import Booking from "@/models/Booking";
import Favorite from "@/models/Favorite";

export default async function DashboardStats() {
    await connectToDB();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

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

    const [bookingsCount, wishlistCount] = await Promise.all([
        Booking.countDocuments({
            userId: user._id,
        }),

        Favorite.countDocuments({
            userId: user._id,
        }),
    ]);

    const stats = [
        {
            title: "رزروهای انجام شده",
            value: bookingsCount.toLocaleString("fa-IR"),
            label: "رزرو",
            icon: CalendarDays,
        },
        {
            title: "علاقه‌مندی‌ها",
            value: wishlistCount.toLocaleString("fa-IR"),
            label: "ویلا",
            icon: Heart,
        },
        {
            title: "تراکنش‌های موفق",
            value: "۸",
            label: "تراکنش",
            icon: WalletCards,
        },
        {
            title: "امتیاز کل شما",
            value: bookingsCount * 5 ,
            label: "امتیاز",
            icon: Star,
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="
                            flex min-h-[105px]
                            items-center
                            gap-4
                            rounded-[12px]
                            border border-gray-200
                            bg-white
                            p-4
                        "
                    >
                        <div
                            className="
                                flex h-[58px]
                                w-[58px]
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#f4f8f6]
                            "
                        >
                            <Icon
                                size={27}
                                strokeWidth={1.7}
                                className="text-[#299768]"
                            />
                        </div>

                        <div>
                            <p className="text-[10px] text-gray-500">
                                {item.title}
                            </p>

                            <p className="mt-1 text-[23px] font-bold text-[#17334d]">
                                {item.value}
                            </p>

                            <p className="text-[9px] text-gray-500">
                                {item.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}