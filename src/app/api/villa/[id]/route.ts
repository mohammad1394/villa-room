import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json(
                { message: "شناسه ویلا معتبر نیست." },
                { status: 400 },
            );
        }

        await connectToDB();

        const villa = await Villa.findById(id).lean();

        if (!villa) {
            return NextResponse.json(
                { message: "ویلا پیدا نشد." },
                { status: 404 },
            );
        }

        return NextResponse.json({ villa }, { status: 200 });
    } catch (error) {
        console.error("GET /api/villa/[id]:", error);

        return NextResponse.json(
            { message: "خطای سرور هنگام دریافت اطلاعات ویلا." },
            { status: 500 },
        );
    }
}