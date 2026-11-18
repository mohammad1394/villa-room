import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Department from "@/models/Department";
import {checkRole} from "@/utility/checkRole";
import {DepartmentSchema} from "@/validator/departmentValidator";

export async function POST(req: NextRequest) {
    try {
   await connectToDB();

        const { response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const body = await req.json().catch(() => null);

        const result = DepartmentSchema.safeParse(body);

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

        const { title } = result.data;

        const existDepartment = await Department.findOne({
            title: title?.trim(),
        })
        if (existDepartment) {
            return NextResponse.json(
                {
                    message: "دپارتمانی با این نام وجود دارد!",
                },
                {
                    status: 422,
                }
            );
        }


        const department = await Department.create({
            title: title.trim(),
        });

        return NextResponse.json(
            {
                message: "دپارتمان مورد نظر با موفقیت ایجاد شد",
                department,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته سمت سرور رخ داده است",
            },
            {
                status: 500,
            }
        );
    }
}


export async function GET() {
    try {
        await connectToDB()

        const departments = await Department.find({} , "-__v");

        return NextResponse.json(departments);


    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته سمت سرور رخ داده است",
            },
            {
                status: 500,
            }
        );
    }
}