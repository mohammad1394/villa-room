import React from 'react';
import DashboardContent from "@/components/templates/adminPanel/dashboard/DashboardContent";
import Booking from "@/models/Booking";
import villa from "@/models/Villa";
import User from "@/models/User";
import connectToDB from "@/config/db";

async function Page() {

        connectToDB();

        const [villaCount, userCount] = await Promise.all([
            villa.countDocuments({}),

            User.countDocuments({}),
        ])

        const bookings = await Booking
            .find({})
            .populate("villaId" , "title -_id")
            .populate("userId" , "fullName -_id")
            .lean()
            .sort({createAt : -1})


    return (
        <div>
            <DashboardContent villaCount={villaCount}  userCount={userCount} bookings = {JSON.parse(JSON.stringify(bookings))}/>
        </div>
    );
}

export default Page;