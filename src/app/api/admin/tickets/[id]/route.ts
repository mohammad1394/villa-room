import {NextRequest, NextResponse} from "next/server";
import {getCurrentUser} from "@/utility/getCurrentUser";
import connectToDB from "@/config/db";
import {isValidObjectId} from "mongoose";
import Ticket from "@/models/Ticket";

const validStatuses = [
    "open",
    "pending",
    "answered",
    "closed",
];

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();

        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "دسترسی غیرمجاز است.",
                },
                {
                    status: 403,
                }
            );
        }

        const { id } = await params;
        const { status } = await req.json();

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه تیکت نامعتبر است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                {
                    message: "وضعیت انتخاب شده معتبر نیست.",
                },
                {
                    status: 400,
                }
            );
        }

        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return NextResponse.json(
                {
                    message: "رزرو پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        ticket.status = status;

        await ticket.save();

        return NextResponse.json(
            {
                message: "وضعیت تیکت با موفقیت تغییر کرد.",
                ticket,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "خطایی در تغییر وضعیت تیکت رخ داد.",
            },
            {
                status: 500,
            }
        );
    }
}