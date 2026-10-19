"use client";

import { useMemo, useState } from "react";
import BookingFilter from "@/components/modules/Booking/BookingFilter";
import BookingCard from "@/components/modules/Booking/BookingCard";


type Booking = {
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

type BookingListProps = {
    bookings: Booking[];
};

export default function BookingList({
                                        bookings,
                                    }: BookingListProps) {
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredBookings = useMemo(() => {
        if (activeFilter === "all") {
            return bookings;
        }

        return bookings.filter(
            (booking) => booking.status === activeFilter
        );
    }, [bookings, activeFilter]);

    if (!bookings.length) {
        return (
            <div className="flex min-h-[350px] items-center justify-center rounded-[16px] border border-gray-200 bg-white">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-2xl">📅</span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800">
                        هنوز رزروی ندارید
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                        رزروهای شما بعد از انجام رزرو در این قسمت نمایش داده می‌شوند.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <BookingFilter
                activeFilter={activeFilter}
                onChange={setActiveFilter}
            />

            <div className="space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                        <BookingCard
                            key={booking._id}
                            booking={booking}
                        />
                    ))
                ) : (
                    <div className="rounded-[16px] border border-gray-200 bg-white py-16 text-center">
                        <p className="text-sm text-gray-400">
                            رزروی در این دسته وجود ندارد.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}