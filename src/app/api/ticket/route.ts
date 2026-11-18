import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import Ticket from "@/models/Ticket";
import Department from "@/models/Department";
import SubDepartment from "@/models/SubDepartment";
import {checkRole} from "@/utility/checkRole";
import {createTicketSchema} from "@/validator/ticketValidator";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();


        const {user ,  response } = await checkRole(["User" , "Admin" , "SuperAdmin"]);

        if (response) {
            return response;
        }

        const reqBody = await req.json().catch(() => null);

        const result = createTicketSchema.safeParse(reqBody);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const {
            title,
            body,
            department,
            subDepartment,
            priority,
        } = result.data;



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
            title,
            body,
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
