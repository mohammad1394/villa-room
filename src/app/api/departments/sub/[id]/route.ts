import {NextRequest, NextResponse} from "next/server";
import SubDepartment from "@/models/SubDepartment";
import connectToDB from "@/config/db";
import {departmentIdSchema} from "@/validator/departmentValidator";
import {Params} from "@/types/Params";

export async function GET(
    req: NextRequest,
    { params }: {
        params: Promise<{ id: string }>;
    }
) {
    try {

        await connectToDB();


        const { id } = await params;

        const result = departmentIdSchema.safeParse({ id });

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "شناسه دپارتمان معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
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

