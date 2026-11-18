
import {NextRequest, NextResponse} from "next/server";
import {MongoServerError} from "mongodb";
import User from "@/models/User";
import {getCurrentUser} from "@/utility/getCurrentUser";

import {updateProfileSchema} from "@/validator/userValidator";
import connectToDB from "@/config/db";


export async function GET() {
    try {
        await connectToDB();
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

        await connectToDB();

        const body = await req.json().catch(() => null);

        const result = updateProfileSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 422,
                }
            );
        }

       const {fullName , email} = result.data

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "ابتدا وارد حساب کاربری شوید" },
                { status: 401 }
            );
        }


        const existingUser = await User.findOne({
            email,
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
                    email,
                    fullName,
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
