import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Department from "@/models/Department";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        const {title} = body;

        if (!title?.trim()) {
            return NextResponse.json(
                {
                    message: "عنوان دپارتمان الزامی می‌باشد!",
                },
                {
                    status: 422,
                }
            );
        }

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