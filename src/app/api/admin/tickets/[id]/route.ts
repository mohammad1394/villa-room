import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Ticket from "@/models/Ticket";
import {checkRole} from "@/utility/checkRole";
import {changeTicketStatusSchema} from "@/validator/ticketValidator";

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();

        const { response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const { id } = await params;

        const body = await request.json().catch(() => null);

        const result = changeTicketStatusSchema.safeParse({
            ticketId : id,
            ticketStatus : body?.status
        });

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const { ticketId, ticketStatus } = result.data;

        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return NextResponse.json(
                {
                    message: "رزرو پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        ticket.status = ticketStatus;

        await ticket.save();

        return NextResponse.json(
            {
                message: "وضعیت تیکت با موفقیت تغییر کرد.",
                ticket,
            },
            {
                status: 200,
            }
        );
    } catch (error) {


        return NextResponse.json(
            {
                message: "خطایی در تغییر وضعیت تیکت رخ داد.",
            },
            {
                status: 500,
            }
        );
    }
}