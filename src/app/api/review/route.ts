import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import Review from "@/models/Review";
import Villa from "@/models/Villa";
import Booking from "@/models/Booking";
import {cookies} from "next/headers";
import {verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";
import {MongoServerError} from "mongodb";


export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();


        const {
            villaId,
            rating,
            comment,
        } = body;

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {status: 401}
            );
        }

        const tokenPayload = verifyAccessToken(token);
        if (!tokenPayload) {
            return NextResponse.json(
                {
                    message: "احراز هویت نامعتبر است",
                },
                {status: 401}
            );
        }

        const user = await UserModel.findOne({email: tokenPayload.email}, "_id");

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {status: 404}
            );
        }


        const userId = user?._id;


        if (
            !villaId ||
            rating === undefined ||
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


        if (rating < 1 || rating > 5) {
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
        }).select("_id status");

        const bookingId = booking.id;


        if (!booking) {
            return NextResponse.json(
                {
                    message:
                        "رزرو معتبری برای این ویلا و کاربر پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }


        if (booking.status !== "confirmed") {
            return NextResponse.json(
                {
                    message: "فقط برای رزروهای تأیید شده امکان ثبت نظر وجود دارد",
                },
                {status: 400}
            );
        }

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
            status: "published",
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