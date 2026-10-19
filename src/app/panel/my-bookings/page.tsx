
import { redirect } from "next/navigation";
import BookingList from "@/components/templates/booking/BookingList";
import {getCurrentUser} from "@/utility/getCurrentUser";
import Booking from "@/models/Booking";
import {BookingType} from "@/types/Booking";







export default async function BookingsPage() {
    const user = await getCurrentUser();

    const bookings : BookingType[] = await Booking.find({
        userId: user._id,
    }).populate(
            "villaId",
            "title city images"
        )
        .sort({ createdAt: -1 })
        .lean();

    const serializedBookings = bookings.map((booking) => ({
        _id: booking._id.toString(),

        villaId: {
            _id: booking.villaId?._id?.toString(),
            title: booking.villaId?.title ?? "",
            city: booking.villaId?.city ?? "",
            images: booking.villaId?.images ?? [],
        },

        checkIn: booking.checkIn,
        checkOut: booking.checkOut,


        nights: booking.nights,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
    }));

    return (
        <main className="min-h-screen bg-[#f8f8f8] py-8 md:py-10">
            <div className=" max-w-[1280px] px-4 sm:px-6 lg:px-8">

                <div className="mb-7">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        رزروهای من
                    </h1>

                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        تمامی رزروهای خود را در این قسمت مشاهده کنید.
                    </p>
                </div>

                <BookingList
                    bookings={serializedBookings}
                />
            </div>
        </main>
    );
}