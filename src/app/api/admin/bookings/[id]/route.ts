import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";
import connectToDB from "@/config/db";
import Booking from "@/models/Booking";
import Villa from "@/models/Villa";
import {checkRole} from "@/utility/checkRole";
import {bookingChangeStatusSchema} from "@/validator/bookingValidator";

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

// "cancelled" and "completed" are final: a cancelled booking cannot be revived,
// because its dates may already be booked by someone else.
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["pending", "completed", "cancelled"],
    cancelled: [],
    completed: [],
};

const PENDING_BOOKING_TTL_MS = 30 * 60 * 1000;

export async function PUT(req: NextRequest, {params}: { params: Promise<{ id: string }> }) {
    try {
        const {response} = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        await connectToDB();

        const {id} = await params;

        const body = await req.json().catch(() => null);

        const result = bookingChangeStatusSchema.safeParse({
            bookingId: id,
            bookingStatus: body?.status,
        });

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                {status: 422}
            );
        }

        const {bookingStatus, bookingId} = result.data;

        const session = await mongoose.startSession();
        let updated: { _id: unknown; status: string } | null = null;

        try {
            await session.withTransaction(async () => {
                updated = null;

                const booking = await Booking.findById(bookingId).session(session);

                if (!booking) {
                    throw new Error("BOOKING_NOT_FOUND");
                }

                const current = booking.status as BookingStatus;

                if (current === bookingStatus) {
                    updated = {_id: booking._id, status: booking.status};
                    return;
                }

                if (!ALLOWED_TRANSITIONS[current]?.includes(bookingStatus)) {
                    throw new Error("INVALID_TRANSITION");
                }

                // moving back to an active status: make sure the dates are still free
                if (bookingStatus === "pending" || bookingStatus === "confirmed") {
                    // same per-villa lock as the booking API, so both are serialized
                    await Villa.updateOne(
                        {_id: booking.villaId},
                        {$inc: {bookingLockVersion: 1}},
                        {session}
                    );

                    const pendingCutoff = new Date(Date.now() - PENDING_BOOKING_TTL_MS);

                    const overlapping = await Booking.findOne({
                        _id: {$ne: booking._id},
                        villaId: booking.villaId,
                        $or: [
                            {status: "confirmed"},
                            {status: "pending", createdAt: {$gt: pendingCutoff}},
                        ],
                        checkIn: {$lt: booking.checkOut},
                        checkOut: {$gt: booking.checkIn},
                    })
                        .select("_id")
                        .session(session);

                    if (overlapping) {
                        throw new Error("BOOKING_DATE_CONFLICT");
                    }
                }

                booking.status = bookingStatus;
                await booking.save({session});

                updated = {_id: booking._id, status: booking.status};
            });
        } finally {
            await session.endSession();
        }

        return NextResponse.json(
            {
                message: "وضعیت رزرو با موفقیت تغییر کرد.",
                booking: updated,
            },
            {status: 200}
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "";

        if (errorMessage === "BOOKING_NOT_FOUND") {
            return NextResponse.json(
                {message: "رزرو پیدا نشد."},
                {status: 404}
            );
        }

        if (errorMessage === "INVALID_TRANSITION") {
            return NextResponse.json(
                {message: "تغییر به این وضعیت برای این رزرو مجاز نیست."},
                {status: 409}
            );
        }

        if (errorMessage === "BOOKING_DATE_CONFLICT") {
            return NextResponse.json(
                {message: "این بازه‌ی زمانی در این ویلا قبلاً رزرو شده است."},
                {status: 409}
            );
        }

        console.error("ADMIN CHANGE BOOKING STATUS ERROR:", error);

        return NextResponse.json(
            {message: "خطایی در تغییر وضعیت رزرو رخ داد."},
            {status: 500}
        );
    }
}
