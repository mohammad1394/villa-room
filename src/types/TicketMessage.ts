import {UserType} from "@/types/User";
import {TicketAttachmentType} from "@/types/TicketAttachment";


export type TicketMessageType  = {
    _id: string;
    ticketId: string;
    senderId: UserType;
    senderRole: "User" | "Admin";
    body: string;
    attachments: TicketAttachmentType[];
    createdAt: string;
    updatedAt: string;
}