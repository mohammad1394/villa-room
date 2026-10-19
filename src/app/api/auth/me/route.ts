import connectToDB from "@/config/db";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import {validateEmail, verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";
import {MongoServerError} from "mongodb";
import User from "@/models/User";
import {getCurrentUser} from "@/utility/getCurrentUser";

export async function GET() {

    try {
        await connectToDB();
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

        const user = await UserModel.findOne({email: tokenPayload.email}, "-password -refreshToken  -__v");

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {status: 404}
            );
        }


        return NextResponse.json(user);
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


export async function PATCH(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();

        const { fullName, email } = body;

        const cleanFullName = fullName?.trim();
        const cleanEmail = email?.trim().toLowerCase();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        const userId = user._id;

        if (!cleanFullName) {
            return NextResponse.json(
                {
                    message: "نام خود را وارد کنید",
                },
                {
                    status: 422,
                }
            );
        }

        if (
            cleanFullName.length < 3 ||
            cleanFullName.length > 50
        ) {
            return NextResponse.json(
                {
                    message:
                        "نام شما باید بین ۳ تا ۵۰ کاراکتر باشد",
                },
                {
                    status: 422,
                }
            );
        }

        if (!cleanEmail) {
            return NextResponse.json(
                {
                    message: "ایمیل را وارد کنید",
                },
                {
                    status: 422,
                }
            );
        }

        const isValidEmail = validateEmail(cleanEmail);

        if (!isValidEmail) {
            return NextResponse.json(
                {
                    message: "ایمیل معتبر نمی‌باشد",
                },
                {
                    status: 422,
                }
            );
        }

        // بررسی تکراری نبودن ایمیل
        const existingUser = await User.findOne({
            email: cleanEmail,
            _id: {
                $ne: userId,
            },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    message:
                        "این ایمیل قبلاً توسط کاربر دیگری استفاده شده است",
                },
                {
                    status: 409,
                }
            );
        }

        // آپدیت کاربر
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    email: cleanEmail,
                    fullName: cleanFullName,
                },
            },
            {
                new: true,
                select: "-password -refreshToken -__v",
            }
        );

        return NextResponse.json(
            {
                message:
                    "اطلاعات با موفقیت تغییر پیدا کرد",

                user: updatedUser,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        if (
            error instanceof MongoServerError &&
            error.code === 11000
        ) {
            return NextResponse.json(
                {
                    message:
                        "این ایمیل قبلاً استفاده شده است",
                },
                {
                    status: 409,
                }
            );
        }

        return NextResponse.json(
            {
                message: "خطایی در سرور رخ داد",
            },
            {
                status: 500,
            }
        );
    }
}