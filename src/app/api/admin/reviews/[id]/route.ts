import connectToDB from "@/config/db";
import {getCurrentUser} from "@/utility/getCurrentUser";
import {NextResponse} from "next/server";
import {isValidObjectId} from "mongoose";
import Review from "@/models/Review";

const validStatuses = [
    "approved",
    "rejected",
];

export async function PATCH(
    request: Request,
    {params}: {params: Promise<{id: string}>}
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

        const {id} = await params;
        const {status} = await request.json();

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه کامنت نامعتبر است.",
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

        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json(
                {
                    message: "کامنت پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        review.status = status;

        await review.save();

        return NextResponse.json(
            {
                message: "وضعیت کامنت با موفقیت تغییر کرد.",
                review,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "خطایی در تغییر وضعیت کامنت رخ داد.",
            },
            {
                status: 500,
            }
        );
    }
}