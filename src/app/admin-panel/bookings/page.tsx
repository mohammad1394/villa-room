import React from 'react';
import BookingsContent from "@/components/templates/adminPanel/bookings/BookingsContent";
import connectToDB from "@/config/db";
import Booking from "@/models/Booking";
import {json} from "node:stream/consumers";

async function Page() {
    await connectToDB();

    const bookings = await Booking
        .find({})
        .populate("villaId" , "title province")
        .populate("userId" , "fullName avatar phone")
        .lean();

    const bookingSerialize = JSON.parse(JSON.stringify(bookings));

    return (
        <div>
            <BookingsContent bookings = {bookingSerialize} />
        </div>
    );
}

export default Page;