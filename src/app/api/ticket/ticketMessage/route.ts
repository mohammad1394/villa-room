import connectToDB from "@/config/db";
import {getCurrentUser} from "@/utility/getCurrentUser";
import {NextRequest, NextResponse} from "next/server";
import {isValidObjectId} from "mongoose";
import Ticket from "@/models/Ticket";
import TicketMessage from "@/models/TicketMessage";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();


        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {message: "برای ثبت تیکت ابتدا وارد حساب کاربری شوید!"},
                {status: 401}
            );
        }


        const reqBody = await req.json();

        const {
            ticketId,
            body,
        } = reqBody;

        if (!ticketId || !isValidObjectId(ticketId)) {
            return NextResponse.json({message: "شناسه تیکت معتبر نمی‌باشد!",}, {status: 422,});
        }

        const ticket = await Ticket.findOne({_id: ticketId,});
        if (!ticket) {
            return NextResponse.json(
                {message: "تیکت مورد نظر شما پیدا نشد!"},
                {status: 404}
            );
        }

        if (user.role !== "Admin" && ticket.userId.toString() !== user._id.toString()) {
            return NextResponse.json(
                {message: "شما اجازه ارسال پیام در این تیکت را ندارید!"},
                {status: 403}
            );
        }
        if (!body?.trim()) {
            return NextResponse.json(
                {message: "متن تیکت رو وارد کنید !"},
                {status: 422}
            );
        }

        if (ticket.status === "closed") {
            return NextResponse.json({message: "این تیکت بسته شده است و امکان ارسال پیام وجود ندارد!",}, {status: 409,});
        }

        const message = await TicketMessage.create({
            ticketId: ticket._id,
            senderId: user._id,
            senderRole: user.role,
            body: body.trim(),
        });

        ticket.lastMessageAt = new Date();
        ticket.lastMessageBy = "user";
        ticket.status = "open";
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


        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "برای مشاهده پیام‌ها ابتدا وارد حساب کاربری شوید!",
                },
                {status: 401}
            );
        }


        const searchParams = req.nextUrl.searchParams;
        const ticketId = searchParams.get("ticketId");


        if (!ticketId || !isValidObjectId(ticketId)) {
            return NextResponse.json(
                {
                    message: "شناسه تیکت معتبر نمی‌باشد!",
                },
                {status: 422}
            );
        }


        const ticket = await Ticket.findOne({
            _id: ticketId,
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

