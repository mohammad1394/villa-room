import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import Review from "@/models/Review";
import Villa from "@/models/Villa";
import Booking from "@/models/Booking";
import UserModel from "@/models/User";
import {MongoServerError} from "mongodb";
import {checkRole} from "@/utility/checkRole";
import {rateLimit} from "@/utility/rateLimit";


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

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                {message: "اطلاعات ارسالی معتبر نیست"},
                {status: 422}
            );
        }


        const {
            villaId,
            rating,
            comment,
        } = body;


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

        const validateRating = typeof rating === "number" ? rating : undefined;

        if (
            !villaId ||
            validateRating === undefined ||
            !comment?.trim()
        ) {
            return NextResponse.json(
                {
                    message:
                        "لطفاً تمام اطلاعات مورد نیاز برای ثبت نظر را وارد کنید",
                },
                {
                    status: 400,
                }
            );
        }


        if (validateRating < 1 || validateRating > 5) {
            return NextResponse.json(
                {
                    message: "امتیاز باید بین 1 تا 5 باشد",
                },
                {
                    status: 400,
                }
            );
        }

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
            comment: comment.trim(),
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

        const {searchParams} = new URL(req.url);
        const villaId = searchParams.get("villaId");

        if (!villaId) {
            return NextResponse.json({
                    message: "شناسه ویلا ارسال نشده است "
                },
                {
                    status: 400,
                })
        }

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