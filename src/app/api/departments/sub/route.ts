import connectToDB from "@/config/db";
import { NextRequest, NextResponse } from "next/server";


import Department from "@/models/Department";
import SubDepartment from "@/models/SubDepartment";
import {checkRole} from "@/utility/checkRole";
import {SubDepartmentSchema} from "@/validator/departmentValidator";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const { response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const body = await req.json().catch(() => null);

        const result = SubDepartmentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                {
                    status: 422,
                }
            )};

        const {title , department} = result.data;




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

