import connectToDB from "@/config/db";
import {getCurrentUser} from "@/utility/getCurrentUser";
import {NextRequest, NextResponse} from "next/server";
import mongoose from "mongoose";

import Ticket from "@/models/Ticket";
import Department from "@/models/Department";
import SubDepartment from "@/models/SubDepartment";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();


        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {message: "برای ثبت تیکت ابتدا وارد حساب کاربری شوید!"},
                {status: 401}
            );
        }

        const reqBody = await req.json();

        const {
            title,
            body,
            department,
            subDepartment,
            priority,
        } = reqBody;


        if (!title?.trim()) {
            return NextResponse.json(
                {message: "عنوان تیکت الزامی است!"},
                {status: 422}
            );
        }

        if (!body?.trim() || body.trim().length < 10) {
            return NextResponse.json(
                {message: "متن تیکت باید حداقل ۱۰ کاراکتر باشد!"},
                {status: 422}
            );
        }

        if (!department) {
            return NextResponse.json(
                {message: "انتخاب دپارتمان الزامی است!"},
                {status: 422}
            );
        }

        if (!subDepartment) {
            return NextResponse.json(
                {message: "انتخاب زیر دپارتمان الزامی است!"},
                {status: 422}
            );
        }


        if (!mongoose.Types.ObjectId.isValid(department)) {
            return NextResponse.json(
                {message: "دپارتمان انتخاب شده معتبر نیست!"},
                {status: 422}
            );
        }

        if (!mongoose.Types.ObjectId.isValid(subDepartment)) {
            return NextResponse.json(
                {message: "زیر دپارتمان انتخاب شده معتبر نیست!"},
                {status: 422}
            );
        }




        if (!["low", "medium", "high"].includes(priority)) {
            return NextResponse.json(
                {message: "اولویت تیکت معتبر نیست!"},
                {status: 422}
            );
        }


        const departmentExists = await Department.findById(department);

        if (!departmentExists) {
            return NextResponse.json(
                {message: "دپارتمان مورد نظر پیدا نشد!"},
                {status: 404}
            );
        }


        const subDepartmentExists = await SubDepartment.findOne({
            _id: subDepartment,
            department: department,
        });

        if (!subDepartmentExists) {
            return NextResponse.json(
                {
                    message:
                        "زیر دپارتمان انتخاب شده متعلق به این دپارتمان نیست!",
                },
                {status: 422}
            );
        }


        const ticket = await Ticket.create({
            userId: user._id,
            title: title.trim(),
            body: body.trim(),
            department,
            subDepartment,
            priority
        });

        return NextResponse.json(
            {
                message: "تیکت با موفقیت ثبت شد!",
                ticket,
            },
            {status: 201}
        );

    } catch (error) {
        console.error("CREATE TICKET ERROR:", error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            {status: 500}
        );
    }
}


export async function GET() {


}