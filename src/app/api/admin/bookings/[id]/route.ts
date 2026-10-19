import {NextRequest, NextResponse} from "next/server";
import Booking from "@/models/Booking";
import {getCurrentUser} from "@/utility/getCurrentUser";
import connectToDB from "@/config/db";
import {isValidObjectId} from "mongoose";

const validStatuses = [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
];

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
                    message: "شناسه رزرو نامعتبر است.",
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

        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json(
                {
                    message: "رزرو پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        booking.status = status;

        await booking.save();

        return NextResponse.json(
            {
                message: "وضعیت رزرو با موفقیت تغییر کرد.",
                booking,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "خطایی در تغییر وضعیت رزرو رخ داد.",
            },
            {
                status: 500,
            }
        );
    }
}