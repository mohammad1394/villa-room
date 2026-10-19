import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utility/auth";
import UserModel from "@/models/User";
import Contact from "@/models/Contact";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();

        const {
            fullName,
            email,
            phone,
            subject,
            message,
        } = body;


        if (!fullName || !fullName.trim()) {
            return NextResponse.json(
                { message: "نام خود را وارد کنید" },
                { status: 422 }
            );
        }

        if (!email || !email.trim()) {
            return NextResponse.json(
                { message: "ایمیل خود را وارد کنید" },
                { status: 422 }
            );
        }

        if (!phone || !phone.trim()) {
            return NextResponse.json(
                { message: "شماره تلفن خود را وارد کنید" },
                { status: 422 }
            );
        }

        if (!subject) {
            return NextResponse.json(
                { message: "موضوع پیام خود را مشخص کنید" },
                { status: 422 }
            );
        }

        if (!message || message.trim().length < 10) {
            return NextResponse.json(
                {
                    message:
                        "طول پیام شما باید حداقل 10 کاراکتر باشد",
                },
                { status: 422 }
            );
        }

        const cleanFullName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();
        const cleanMessage = message.trim();


        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        const tokenPayload = verifyAccessToken(token);

        if (!tokenPayload) {
            return NextResponse.json(
                {
                    message: "احراز هویت نامعتبر است",
                },
                {
                    status: 401,
                }
            );
        }

        const user = await UserModel.findOne(
            {
                email: tokenPayload.email,
            },
            "_id"
        );

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }


        const newMessage = await Contact.create({
            userId: user._id,
            fullName: cleanFullName,
            email: cleanEmail,
            phone: cleanPhone,
            subject,
            message: cleanMessage,
        });

        return NextResponse.json(
            {
                message: "پیام شما با موفقیت ثبت شد",
                contact: newMessage,
            },
            {
                status: 201,
            }
        );

    } catch (err) {
        console.log("CONTACT_POST_ERROR:", err);

        return NextResponse.json(
            {
                message: "خطایی در ثبت پیام رخ داد",
            },
            {
                status: 500,
            }
        );
    }
}