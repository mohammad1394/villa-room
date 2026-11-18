import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import {isValidObjectId} from "mongoose";
import Ticket from "@/models/Ticket";
import TicketMessage from "@/models/TicketMessage";
import {checkRole} from "@/utility/checkRole";
import {createTicketSchema} from "@/validator/ticketValidator";
import {createTicketMessageSchema, ticketMessageQuerySchema} from "@/validator/ticketMessageValidator";





export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const {user ,  response } = await checkRole(["User" , "Admin" , "SuperAdmin"]);

        if (response) {
            return response;
        }


        const reqBody = await req.json().catch(() =>  null);

        const result = createTicketMessageSchema.safeParse(reqBody);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }
        const {ticketId, body} = result.data;

        const ticket = await Ticket.findOne({_id: ticketId,});
        if (!ticket) {
            return NextResponse.json(
                {message: "تیکت مورد نظر شما پیدا نشد!"},
                {status: 404}
            );
        }

        if (user.role === "User" && ticket.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                {message: "شما اجازه ارسال پیام در این تیکت را ندارید!"},
                {status: 403}
            );
        }

        if (ticket.status === "closed") {
            return NextResponse.json({message: "این تیکت بسته شده است و امکان ارسال پیام وجود ندارد!",}, {status: 409,});
        }

        const message = await TicketMessage.create({
            ticketId: ticket._id,
            senderId: user._id,
            senderRole: user.role === "User" ? "User" : "Support",
            body: body.trim(),
        });

        ticket.lastMessageAt = new Date();
        ticket.lastMessageBy = user.role === "User" ? "User" : "Support";
        ticket.status = user.role === "User" ? "open" : "answered";
        await ticket.save();

        return NextResponse.json({message: "پیام شما با موفقیت ارسال شد!", data: message,}, {status: 201,});

    } catch (error) {
        console.error("CREATE TICKET ERROR:", error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            {status: 500}
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const {user ,  response } = await checkRole(["User"]);

        if (response) {
            return response;
        }

        const searchParams = req.nextUrl.searchParams;

        const id = searchParams.get("ticketId");

        const result = ticketMessageQuerySchema.safeParse({
            ticketId : id,
        });

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "شناسه تیکت معتبر نمیباشد",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 422,
                }
            );
        }

        const { ticketId } = result.data;

        const ticket = await Ticket.findOne({
            _id: ticketId ,
            userId: user._id,
        }).lean();

        if (!ticket) {
            return NextResponse.json(
                {
                    message: "تیکت مورد نظر پیدا نشد!",
                },
                {status: 404}
            );
        }

        const messages = await TicketMessage.find({
            ticketId: ticket._id,
        })
            .populate("senderId", "fullName avatar")
            .sort({createdAt: 1})
            .lean();

        return NextResponse.json(
            {
                message: "پیام‌های تیکت با موفقیت دریافت شدند!",
                messages,
            },
            {status: 200}
        );

    } catch (error) {
        console.error("GET TICKET MESSAGES ERROR:", error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            {status: 500}
        );
    }
}

