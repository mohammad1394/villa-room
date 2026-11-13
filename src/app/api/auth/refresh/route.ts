
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDB from "@/config/db";
import UserModel from "@/models/User";
import {
    generateAccessToken,
    verifyRefreshToken,
    hashToken,
} from "@/utility/auth";

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete("token");
    response.cookies.delete("refreshToken");

    return response;
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const refreshToken = req.cookies.get("refreshToken")?.value;

        if (!refreshToken) {
            const response = NextResponse.json(
                { message: "لطفاً دوباره وارد حساب خود شوید." },
                { status: 401 }
            );

            return clearAuthCookies(response);
        }

        const tokenPayload = verifyRefreshToken(refreshToken);

        if (
            !tokenPayload ||
            !mongoose.isValidObjectId(tokenPayload.userId)
        ) {
            const response = NextResponse.json(
                { message: "Refresh Token نامعتبر یا منقضی شده است." },
                { status: 401 }
            );

            return clearAuthCookies(response);
        }

        const user = await UserModel.findOne({
            _id: tokenPayload.userId,
            refreshToken: hashToken(refreshToken),
            status: "active",
        }).select("_id");

        if (!user) {
            const response = NextResponse.json(
                { message: "نشست شما معتبر نیست. دوباره وارد شوید." },
                { status: 401 }
            );

            return clearAuthCookies(response);
        }

        const newAccessToken = generateAccessToken({
            userId: tokenPayload.userId,
        });

        const response = NextResponse.json(
            { message: "توکن با موفقیت تمدید شد." },
            { status: 200 }
        );

        response.cookies.set("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60,
        });

        return response;
    } catch (error) {
        console.error("Refresh token error:", error);

        return NextResponse.json(
            { message: "خطایی در سرور رخ داده است." },
            { status: 500 }
        );
    }
}
