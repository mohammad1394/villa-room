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
import {checkRole} from "@/utility/checkRole";

async function Page({params}: { params: Promise<{ id: string }>; }) {
    await connectToDB();

    const { response } = await checkRole(["Admin" , "SuperAdmin"]);

    if (response) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-red-500">
                    شما اجازه دسترسی به این صفحه را ندارید.
                </p>
            </div>
        );
    }
    const { id } = await params;


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
                backUrl="/admin-panel/tickets"
            />
        </div>
    );
}

export default Page;

