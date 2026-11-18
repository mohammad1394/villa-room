import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import {villaInfoQuerySchema} from "@/validator/villaValidator";
import {Params} from "@/types/Params";

export async function GET( req : NextRequest , {params} : Params) {
    try {
        await connectToDB();

        const { id } = await params;

        const result = villaInfoQuerySchema.safeParse(id)

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }


        const villa = await Villa.findOne({ _id: id, isActive: true }).lean();

        if (!villa) {
            return NextResponse.json(
                { message: "ویلا پیدا نشد." },
                { status: 404 },
            );
        }

        return NextResponse.json({ villa }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "خطای سرور هنگام دریافت اطلاعات ویلا." },
            { status: 500 },
        );
    }
}