import connectToDB from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import Department from "@/models/Department";
import SubDepartment from "@/models/SubDepartment";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();

        const { title, department } = body;


        if (!title?.trim()) {
            return NextResponse.json(
                {
                    message: "عنوان زیر دپارتمان الزامی است!",
                },
                { status: 422 }
            );
        }


        if (!department) {
            return NextResponse.json(
                {
                    message: "انتخاب دپارتمان الزامی است!",
                },
                { status: 422 }
            );
        }


        if (!mongoose.Types.ObjectId.isValid(department)) {
            return NextResponse.json(
                {
                    message: "شناسه دپارتمان معتبر نیست!",
                },
                { status: 422 }
            );
        }


        const departmentExists = await Department.findById(department);

        if (!departmentExists) {
            return NextResponse.json(
                {
                    message: "دپارتمان مورد نظر پیدا نشد!",
                },
                { status: 404 }
            );
        }


        const existingSubDepartment = await SubDepartment.findOne({
            title: title.trim(),
            department,
        });

        if (existingSubDepartment) {
            return NextResponse.json(
                {
                    message: "این زیر دپارتمان قبلاً برای این دپارتمان ثبت شده است!",
                },
                { status: 409 }
            );
        }


        const subDepartment = await SubDepartment.create({
            title: title.trim(),
            department,
        });

        return NextResponse.json(
            {
                message: "زیر دپارتمان با موفقیت ایجاد شد!",
                subDepartment,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("CREATE SUB DEPARTMENT ERROR:", error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            { status: 500 }
        );
    }
}

