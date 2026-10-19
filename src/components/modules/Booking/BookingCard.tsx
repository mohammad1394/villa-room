"use client";

import Image from "next/image";
import Link from "next/link";
import {
    CalendarDays,
    MapPin,
    Users,
    Moon,
    ChevronLeft,
} from "lucide-react";

type BookingCardProps = {
    booking: {
        _id: string;
        villaId: {
            _id: string;
            title: string;
            city: string;
            images: string[];
        };
        checkIn: string;
        checkOut: string;
        nights: number;
        guests: number;
        totalPrice: number;
        status:
            | "pending"
            | "confirmed"
            | "cancelled"
            | "completed";

    };
};

export default function BookingCard({booking}: BookingCardProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("fa-IR");
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fa-IR").format(price);
    };

    const isActive = booking.status === "completed";

    return (
        <article
            className="w-full overflow-hidden rounded-[16px] border border-gray-200 bg-white transition hover:shadow-md"
        >
            <div className="flex flex-col gap-4 p-4 sm:flex-row">

                {/* Image */}
                <div
                    className="relative h-[210px] w-full shrink-0 overflow-hidden rounded-[12px] sm:h-[180px] sm:w-[230px]">
                    <Image
                        src={booking.villaId.images?.[0] || "/assets/placeholder.jpg"}
                        alt={booking.villaId.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="line-clamp-1 text-[17px] font-bold text-[var(--text-primary)]">
                                {booking.villaId.title}
                            </h2>

                            <div className="mt-2 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                                <MapPin size={16}/>
                                <span>{booking.villaId.city}</span>
                            </div>
                        </div>

                        <span
                            className={`
                                shrink-0
                                rounded-full
                                px-3 py-1
                                text-xs font-medium
                                ${
                                isActive
                                    ? "bg-green-50 text-green-600"
                                    : "bg-gray-100 text-gray-500"
                            }
                            `}
                        >
                            {isActive ? "رزرو شده" : "پایان یافته"}
                        </span>
                    </div>

                    {/* Booking Info */}
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <div>
                                <p className="text-[11px] text-gray-400">
                                    ورود
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                    {formatDate(booking.checkIn)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <div>
                                <p className="text-[11px] text-gray-400">
                                    خروج
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                    {formatDate(booking.checkOut)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Moon
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <div>
                                <p className="text-[11px] text-gray-400">
                                    مدت اقامت
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                    {booking.nights} شب
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users
                                size={17}
                                className="text-[var(--primary)]"
                            />

                            <div>
                                <p className="text-[11px] text-gray-400">
                                    مهمان
                                </p>

                                <p className="text-xs font-medium text-gray-700">
                                    {booking.guests} نفر
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <span className="text-xs text-gray-400">
                                مبلغ کل
                            </span>

                            <div className="mt-1">
                                <span className="text-[17px] font-bold text-[var(--text-primary)]">
                                    {formatPrice(booking.totalPrice)}
                                </span>

                                <span className="mr-1 text-xs text-gray-400">
                                    تومان
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/dashboard/bookings/${booking._id}`}
                            className="flex h-[42px] items-center justify-center gap-1 rounded-[10px] border border-[var(--primary)] px-5 text-sm font-medium text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                        >
                            مشاهده جزئیات
                            <ChevronLeft size={17}/>
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}