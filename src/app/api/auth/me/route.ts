import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import {validateEmail} from "@/utility/auth";
import {MongoServerError} from "mongodb";
import User from "@/models/User";
import {getCurrentUser} from "@/utility/getCurrentUser";


export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "ابتدا وارد حساب کاربری شوید" },
                { status: 401 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Get user error:", error);

        return NextResponse.json(
            { message: "خطایی در دریافت اطلاعات کاربر رخ داد" },
            { status: 500 }
        );
    }
}




export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();

        if (
            !body ||
            typeof body !== "object" ||
            Array.isArray(body)
        ) {
            return NextResponse.json(
                { message: "اطلاعات ارسالی معتبر نیست" },
                { status: 422 }
            );
        }

        const { fullName, email } = body;

        if (
            typeof fullName !== "string" ||
            typeof email !== "string"
        ) {
            return NextResponse.json(
                { message: "نام و ایمیل باید به‌صورت متن ارسال شوند" },
                { status: 422 }
            );
        }

        const cleanFullName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "ابتدا وارد حساب کاربری شوید" },
                { status: 401 }
            );
        }

        if (cleanFullName.length < 3 || cleanFullName.length > 50) {
            return NextResponse.json(
                { message: "نام شما باید بین ۳ تا ۵۰ کاراکتر باشد" },
                { status: 422 }
            );
        }

        if (!cleanEmail) {
            return NextResponse.json(
                { message: "ایمیل را وارد کنید" },
                { status: 422 }
            );
        }

        if (!validateEmail(cleanEmail)) {
            return NextResponse.json(
                { message: "ایمیل معتبر نمی‌باشد" },
                { status: 422 }
            );
        }

        const existingUser = await User.findOne({
            email: cleanEmail,
            _id: { $ne: user._id },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "این ایمیل قبلاً توسط کاربر دیگری استفاده شده است" },
                { status: 409 }
            );
        }

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: user._id,
                status: "active",
            },
            {
                $set: {
                    email: cleanEmail,
                    fullName: cleanFullName,
                },
            },
            {
                new: true,
                runValidators: true,
                select: "-password -refreshToken -__v",
            }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "حساب کاربری فعال نیست یا پیدا نشد" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                message: "اطلاعات با موفقیت تغییر پیدا کرد",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Update profile error:", error);

        if (
            error instanceof MongoServerError &&
            error.code === 11000
        ) {
            return NextResponse.json(
                { message: "این ایمیل قبلاً استفاده شده است" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { message: "خطایی در سرور رخ داد" },
            { status: 500 }
        );
    }
}
