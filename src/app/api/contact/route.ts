import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import UserModel from "@/models/User";
import Contact from "@/models/Contact";
import {checkRole} from "@/utility/checkRole";
import {rateLimit} from "@/utility/rateLimit";
import {contactUsSchema} from "@/validator/contactUsValidator";

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

        const result = contactUsSchema.safeParse(body);

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

        const {
            fullName,
            email,
            phone,
            subject,
            message,
        } = result.data;


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
            fullName,
            email,
            phone,
            subject,
            message
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