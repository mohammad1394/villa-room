import React from "react";
import { notFound, redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";

import TicketChat from "@/components/templates/TicketChat/TicketChat";
import connectToDB from "@/config/db";

import TicketMessage from "@/models/TicketMessage";
import { getCurrentUser } from "@/utility/getCurrentUser";
import Ticket from "@/models/Ticket";
import Department from "@/models/Department";
import SubDepartment from "@/models/SubDepartment";

async function Page({
                        params,
                    }: {
    params: Promise<{ id: string }>;
}) {
    await connectToDB();

    const { id } = await params;



    const user = await getCurrentUser();

    if (!user || user.role !== "Admin") {
        redirect("/login");
    }


    if (!id || !isValidObjectId(id)) {
        notFound();
    }

    const ticket = await Ticket.findOne({
        _id: id,
    })
        .populate("department", "title")
        .populate("subDepartment", "title")
        .lean();

    if (!ticket) {
        notFound();
    }


    const messages = await TicketMessage.find({
        ticketId: ticket._id,
    })
        .populate("senderId", "fullName avatar")
        .sort({ createdAt: 1 })
        .lean();

    const serializedTicket = JSON.parse(
        JSON.stringify(ticket)
    );

    const serializedMessages = JSON.parse(
        JSON.stringify(messages)
    );


    return (
        <div className="w-full">
            <TicketChat
                ticket={serializedTicket}
                messages={serializedMessages}
            />
        </div>
    );
}

export default Page;

