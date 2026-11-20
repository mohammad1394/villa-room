import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import Discount from "@/models/Discount";
import {checkRole} from "@/utility/checkRole";
import {createDiscountSchema} from "@/validator/discountValidator";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const { user, response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const body = await req.json().catch(() => null);

        const result = createDiscountSchema.safeParse(body);

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
            code,
            villaId,
            maxUse,
            expire,
            percent,
        } = result.data;



        const villa = await Villa.findById(villaId);

        if (!villa) {
            return NextResponse.json(
                {message: "ویلای مورد نظر پیدا نشد"},
                {status: 404}
            );
        }


        const existingDiscount = await Discount.findOne({
            code
        });

        if (existingDiscount) {
            return NextResponse.json(
                {message: "این کد تخفیف قبلاً ثبت شده است"},
                {status: 409}
            );
        }

        await Discount.create({
            code,
            userId : user._id,
            villaId,
            maxUse,
            expire,
            percent,
        });

        return NextResponse.json(
            {message: "کد تخفیف با موفقیت ایجاد شد"},
            {status: 201}
        );

    } catch (error) {


        return NextResponse.json(
            {
                message: "خطایی در ایجاد کد تخفیف رخ داد.",
            },
            {
                status: 500,
            }
        );
    }
}