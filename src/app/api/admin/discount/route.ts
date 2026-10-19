import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import {isValidObjectId} from "mongoose";
import Villa from "@/models/Villa";
import Discount from "@/models/Discount";
import {getCurrentUser} from "@/utility/getCurrentUser";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const user = await getCurrentUser();

        if (!user || user.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "دسترسی غیرمجاز است.",
                },
                {
                    status: 403,
                }
            );
        }

        const body = await req.json();



        const {
            code,
            villaId,
            maxUse,
            expire,
            percent,
        } = body.onSubmit;


        if (!code || !code.trim()) {
            return NextResponse.json(
                {message: "کد تخفیف را وارد کنید"},
                {status: 422}
            );
        }

        if (!villaId || !isValidObjectId(villaId)) {
            return NextResponse.json(
                {message: "شناسه ویلا معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        const villa = await Villa.findById(villaId);

        if (!villa) {
            return NextResponse.json(
                {message: "ویلای مورد نظر پیدا نشد"},
                {status: 404}
            );
        }

        if (!Number.isInteger(maxUse) || maxUse < 1) {
            return NextResponse.json(
                {message: "تعداد استفاده مجاز معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        const expireDate = new Date(expire);

        if (isNaN(expireDate.getTime()) || expireDate <= new Date()) {
            return NextResponse.json(
                {message: "تاریخ انقضای کد تخفیف معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        if (
            !Number.isFinite(percent) ||
            percent < 1 ||
            percent > 100
        ) {
            return NextResponse.json(
                {message: "درصد تخفیف معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        const normalizedCode = code.trim().toUpperCase();

        const existingDiscount = await Discount.findOne({
            code: normalizedCode,
        });

        if (existingDiscount) {
            return NextResponse.json(
                {message: "این کد تخفیف قبلاً ثبت شده است"},
                {status: 409}
            );
        }

        await Discount.create({
            code: normalizedCode,
            userId : user._id,
            villaId,
            maxUse,
            expire: expireDate,
            percent,
        });

        return NextResponse.json(
            {message: "کد تخفیف با موفقیت ایجاد شد"},
            {status: 201}
        );

    } catch (error) {
        console.error(error);

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