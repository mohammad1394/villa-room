import React from 'react';
import TicketsContent from "@/components/templates/adminPanel/tickets/TicketsContent";
import connectToDB from "@/config/db";
import Department from "@/models/Department";
import Ticket from "@/models/Ticket";


async function Page() {

    await connectToDB();

    void Department;

    const tickets = await Ticket
        .find()
        .populate("userId" , "fullName avatat phone")
        .populate("department")
        .lean();

    const ticketsSerialize = JSON.parse(JSON.stringify(tickets));

    return (
        <div>
            <TicketsContent  tickets = {ticketsSerialize}/>
        </div>
    );
}

export default Page;