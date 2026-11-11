
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import UserModel from "@/models/User";
import { verifyRefreshToken } from "@/utility/auth";

export async function DELETE(req: NextRequest) {
    const response = NextResponse.json(
        { message: "شما با موفقیت خارج شدید" },
        { status: 200 }
    );

    response.cookies.delete("token");
    response.cookies.delete("refreshToken");

    try {
        await connectToDB();

        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            return response;
        }

        const payload = verifyRefreshToken(refreshToken);

        if (!payload) {
            return response;
        }

        await UserModel.findOneAndUpdate(
            {
                _id: payload.userId,
                refreshToken,
            },
            {
                $unset: { refreshToken: 1 },
            }
        );

        return response;
    } catch (error) {
        console.error("Logout error:", error);

        return NextResponse.json(
            { message: "خروج از حساب با مشکل مواجه شد" },
            { status: 500 }
        );
    }
}
