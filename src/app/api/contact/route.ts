import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import UserModel from "@/models/User";
import Contact from "@/models/Contact";
import {checkRole} from "@/utility/checkRole";
import {rateLimit} from "@/utility/rateLimit";

export async function POST(req: NextRequest) {
    const limited = rateLimit(req, {
        key: "contact",
        limit: 5,
        windowSeconds: 10 * 60,
    });

    if (limited) {
        return limited;
    }

    try {
        await connectToDB();

        const {user, response} = await checkRole(["User" , "Admin" , "SuperAdmin"]);

        if (response) {
            return response;
        }

        const body = await req.json().catch(() => null);

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { message: "اطلاعات ارسالی معتبر نیست" },
                { status: 422 }
            );
        }

        const {
            fullName,
            email,
            phone,
            subject,
            message,
        } = body;


        const cleanFullName =
            typeof fullName === "string" ? fullName.trim() : "";

        const cleanEmail =
            typeof email === "string" ? email.trim().toLowerCase() : "";

        const cleanPhoneNumber =
            typeof phone === "string" ? phone.trim() : "";

        const cleanMessage =
            typeof message === "string" ? message.trim() : "";

        if (!cleanFullName) {
            return NextResponse.json(
                { message: "نام خود را وارد کنید" },
                { status: 422 }
            );
        }

        if (!cleanEmail) {
            return NextResponse.json(
                { message: "ایمیل خود را وارد کنید" },
                { status: 422 }
            );
        }

        if (!cleanPhoneNumber) {
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

        if (!cleanMessage || cleanMessage.length < 10) {
            return NextResponse.json(
                {
                    message:
                        "طول پیام شما باید حداقل 10 کاراکتر باشد",
                },
                { status: 422 }
            );
        }


        const findUser = await UserModel.findOne(
            {
                _id: user._id,
            },
            "_id"
        );

        if (!findUser) {
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
            phone: cleanPhoneNumber,
            subject,
            message: cleanMessage,
        });

        return NextResponse.json(
            {
                message: "پیام شما با موفقیت ثبت شد",
                contactId: newMessage._id,
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