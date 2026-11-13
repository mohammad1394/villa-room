
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import {
    generateAccessToken,
    generateRefreshToken,
    validateEmail,
    verifyPassword,
    hashToken,
    getDummyPasswordHash,
} from "@/utility/auth";
import { rateLimit } from "@/utility/rateLimit";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
    const limited = rateLimit(req, {
        key: "login",
        limit: 10,
        windowSeconds: 60,
    });

    if (limited) {
        return limited;
    }

    try {
        await connectToDB();

        const body = await req.json().catch(() => null);

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { message: "اطلاعات ورود معتبر نیستند" },
                { status: 422 }
            );
        }

        const { email, password } = body;

        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json(
                { message: "اطلاعات ورود معتبر نیستند" },
                { status: 422 }
            );
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            return NextResponse.json(
                { message: "ایمیل را وارد کنید" },
                { status: 422 }
            );
        }

        if (!password.trim()) {
            return NextResponse.json(
                { message: "رمز عبور را وارد کنید" },
                { status: 422 }
            );
        }

        if (!validateEmail(cleanEmail)) {
            return NextResponse.json(
                { message: "ایمیل معتبر نمی‌باشد" },
                { status: 422 }
            );
        }

        const user = await UserModel.findOne({ email: cleanEmail });

        // always run bcrypt so response time does not reveal whether the email exists
        const isPasswordValid = await verifyPassword(
            password,
            user?.password ?? (await getDummyPasswordHash())
        );

        if (!user) {
            return NextResponse.json(
                { message: "ایمیل یا رمز عبور صحیح نمی‌باشد" },
                { status: 401 }
            );
        }

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "ایمیل یا رمز عبور صحیح نمی‌باشد" },
                { status: 401 }
            );
        }

        if (user.status !== "active") {
            return NextResponse.json(
                { message: "حساب کاربری شما مسدود شده است" },
                { status: 403 }
            );
        }

        const userId = user._id.toString();

        const accessToken = generateAccessToken({ userId });
        const refreshToken = generateRefreshToken({ userId });

        const updatedUser = await UserModel.findOneAndUpdate(
            {
                _id: user._id,
                status: "active",
            },
            {
                $set: { refreshToken: hashToken(refreshToken) },
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: "حساب کاربری شما قابل ورود نیست" },
                { status: 403 }
            );
        }

        const response = NextResponse.json(
            { message: "با موفقیت وارد شدید" },
            { status: 200 }
        );

        const isProduction = process.env.NODE_ENV === "production";

        response.cookies.set("token", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 60,
        });

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 15 * 24 * 60 * 60,
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);

        return NextResponse.json(
            { message: "خطایی در سرور رخ داد" },
            { status: 500 }
        );
    }
}
