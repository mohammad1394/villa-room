import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Booking from "@/models/Booking";
import Villa from "@/models/Villa";
import {checkRole} from "@/utility/checkRole";
import {bookingApiSchema} from "@/validator/BookingApiSchema";

import mongoose from "mongoose";

// A "pending" booking that is not confirmed within this time no longer blocks the dates.
const PENDING_BOOKING_TTL_MS = 30 * 60 * 1000;

type CreatedBooking = {
    _id: mongoose.Types.ObjectId;
    status: string;
    checkIn: Date;
    checkOut: Date;
    guests: number;
    nights: number;
    totalPrice: number;
};

const calculateNights = (checkIn: Date, checkOut: Date) => {
    const start = Date.UTC(
        checkIn.getUTCFullYear(),
        checkIn.getUTCMonth(),
        checkIn.getUTCDate()
    );

    const end = Date.UTC(
        checkOut.getUTCFullYear(),
        checkOut.getUTCMonth(),
        checkOut.getUTCDate()
    );

    return Math.round(
        (end - start) / (1000 * 60 * 60 * 24)
    );
};

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const {user, response} = await checkRole(["User"]);

        if (response) {
            return response;
        }

        const body = await req.json().catch(() => null);

        if (!body) {
            return NextResponse.json(
                {message: "اطلاعات ارسالی معتبر نیست"},
                {status: 400}
            );
        }

        const validation = bookingApiSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات رزرو معتبر نیست",
                    errors: validation.error.flatten().fieldErrors,
                },
                {status: 400}
            );
        }

        const {
            villaId,
            fullName,
            phoneNumber,
            checkIn,
            checkOut,
            guests,
        } = validation.data;

        const nights = calculateNights(checkIn, checkOut);
        const session = await mongoose.startSession();
        let createdBooking: CreatedBooking | null = null;

        try {
            await session.withTransaction(async () => {
                createdBooking = null;

                const villa = await Villa.findOneAndUpdate(
                    {
                        _id: villaId,
                        isActive: true,
                    },
                    {
                        $inc: {bookingLockVersion: 1},
                    },
                    {
                        new: true,
                        session,
                    }
                );

                if (!villa) {
                    throw new Error("VILLA_NOT_FOUND");
                }

                if (guests > villa.capacity) {
                    throw new Error("VILLA_CAPACITY_EXCEEDED");
                }

                const pendingCutoff = new Date(
                    Date.now() - PENDING_BOOKING_TTL_MS
                );

                const overlappingBooking = await Booking.findOne({
                    villaId: villa._id,
                    $or: [
                        {status: "confirmed"},
                        {
                            status: "pending",
                            createdAt: {$gt: pendingCutoff},
                        },
                    ],
                    checkIn: {
                        $lt: checkOut,
                    },
                    checkOut: {
                        $gt: checkIn,
                    },
                })
                    .select("_id")
                    .session(session);

                if (overlappingBooking) {
                    throw new Error("BOOKING_DATE_CONFLICT");
                }

                const pricePerNight = villa.pricePerNight;

                if (
                    !Number.isFinite(pricePerNight) ||
                    pricePerNight <= 0
                ) {
                    throw new Error("INVALID_VILLA_PRICE");
                }

                const subtotal = nights * pricePerNight;
                const serviceFee = Math.round(subtotal * 0.02);
                const totalPrice = subtotal + serviceFee;

                const bookings = await Booking.create(
                    [{
                        userId: user._id,
                        villaId: villa._id,
                        fullName,
                        phoneNumber,
                        checkIn,
                        checkOut,
                        guests,
                        nights,
                        pricePerNight,
                        subtotal,
                        serviceFee,
                        totalPrice,
                        status: "pending",
                    }],
                    {session}
                );

                const saved = bookings[0];

                createdBooking = {
                    _id: saved._id,
                    status: saved.status,
                    checkIn: saved.checkIn,
                    checkOut: saved.checkOut,
                    guests: saved.guests,
                    nights: saved.nights,
                    totalPrice: saved.totalPrice,
                };
            });
        } finally {
            await session.endSession();
        }

        return NextResponse.json(
            {
                message: "رزرو ویلا با موفقیت ثبت شد",
                booking: createdBooking,
            },
            {status: 201}
        );
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "UNKNOWN_ERROR";

        if (errorMessage === "BOOKING_DATE_CONFLICT") {
            return NextResponse.json(
                {
                    message: "این ویلا در بازه زمانی انتخاب شده قبلاً رزرو شده است",
                },
                {status: 409}
            );
        }

        if (errorMessage === "VILLA_NOT_FOUND") {
            return NextResponse.json(
                {message: "ویلا یافت نشد یا غیرفعال است"},
                {status: 404}
            );
        }

        if (errorMessage === "VILLA_CAPACITY_EXCEEDED") {
            return NextResponse.json(
                {message: "تعداد مهمان‌ها بیشتر از ظرفیت ویلا است"},
                {status: 400}
            );
        }

        if (errorMessage === "INVALID_VILLA_PRICE") {
            return NextResponse.json(
                {message: "قیمت ویلا معتبر نیست"},
                {status: 400}
            );
        }

        console.error("CREATE BOOKING ERROR:", error);

        return NextResponse.json(
            {message: "خطای ناشناخته سمت سرور رخ داده است"},
            {status: 500}
        );
    }
}

export async function GET() {
    try {
        const {user , response} = await checkRole(["User"]);

        if (response) {
            return response;
        }

        await connectToDB();

        const bookings = await Booking.find({
            userId: user._id,
        })
            .sort({createdAt: -1})
            .lean();

        return NextResponse.json(
            {bookings},
            {status: 200}
        );

    } catch (error) {
        console.error("GET BOOKINGS ERROR:", error);

        return NextResponse.json(
            {message: "خطای ناشناخته سمت سرور رخ داده است"},
            {status: 500}
        );
    }
}
