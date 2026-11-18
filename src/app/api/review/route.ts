import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import Review from "@/models/Review";
import Villa from "@/models/Villa";
import Booking from "@/models/Booking";
import UserModel from "@/models/User";
import {MongoServerError} from "mongodb";
import {checkRole} from "@/utility/checkRole";
import {rateLimit} from "@/utility/rateLimit";
import {createReviewSchema, reviewQuerySchema} from "@/validator/reviewValidator";


export async function POST(req: NextRequest) {
    const limited = rateLimit(req, {
        key: "review",
        limit: 10,
        windowSeconds: 10 * 60,
    });

    if (limited) {
        return limited;
    }

    try {
        await connectToDB();

        const { user : currentUser , response } = await checkRole(["User"]);

        if (response) {
            return response;
        }
        const body = await req.json().catch(() => null);

        const result = createReviewSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const { villaId, rating, comment } = result.data;

        const user = await UserModel.findOne({_id: currentUser._id}, "_id");

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {status: 404}
            );
        }


        const userId = user?._id;


        const booking = await Booking.findOne({
            userId,
            villaId,
            status: "completed",
        }).select("_id");

        if (!booking) {
            return NextResponse.json(
                { message: "رزرو معتبری پیدا نشد" },
                { status: 404 }
            );
        }

        const bookingId = booking._id;

        const villa = await Villa.findById(villaId);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلا پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }


        const newReview = await Review.create({
            userId,
            villaId,
            bookingId,
            rating,
            comment,
            status: "pending",
        });


        return NextResponse.json(
            {
                message:
                    "نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد",
                review: newReview,
            },
            {
                status: 201,
            }
        );
    } catch (error) {

        console.error(error);
        if (error instanceof MongoServerError && error.code === 11000) {
            return NextResponse.json(
                {
                    message: "شما قبلاً برای این رزرو نظر ثبت کرده‌اید",
                },
                {
                    status: 409,
                }
            );
        }

        return NextResponse.json(
            {
                message:
                    "خطای ناشناخته سمت سرور رخ داده است، دوباره تلاش کنید",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);

        const result = reviewQuerySchema.safeParse({
            villaId: searchParams.get("villaId"),
        });

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا ارسال نشده یا معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const { villaId } = result.data;

        const reviews = await Review.find({
            villaId,
            status: "approved",
        } , "userId rating comment createdAt").populate("userId", "-_id fullName avatar");
        return NextResponse.json(reviews);

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                message:
                    "خطای ناشناخته سمت سرور رخ داده است، دوباره تلاش کنید",
            },
            {
                status: 500,
            }
        )
    }
}