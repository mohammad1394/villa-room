import {isValidObjectId} from "mongoose";
import {NextResponse} from "next/server";
import SubDepartment from "@/models/SubDepartment";
import connectToDB from "@/config/db";

export async function GET(
    req: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    try {

        await connectToDB();


        const {id} = await params;


        if (!id || !isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه دپارتمان ارسال شده معتبر نمی‌باشد!",
                },
                {
                    status: 422,
                }
            );
        }


        const subDepartments = await SubDepartment
            .find({department: id})
            .select("_id title department")
            .sort({title: 1})
            .lean();


        if (subDepartments.length === 0) {
            return NextResponse.json(
                {
                    message: "برای این دپارتمان زیر دپارتمانی ثبت نشده است!",
                    subDepartments: [],
                },
                {
                    status: 200,
                }
            );
        }

        return NextResponse.json(subDepartments)

    } catch (error) {
        console.error("GET SUB DEPARTMENTS ERROR:", error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            {
                status: 500,
            }
        );
    }
}

