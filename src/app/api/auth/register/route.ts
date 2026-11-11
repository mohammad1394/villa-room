import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    validateEmail,
    validatePassword,
    validatePhone
} from "@/utility/auth";
import UserModel from "@/models/User"


export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();

        const {
            fullName,
            email,
            password,
            repeatPassword,
            phoneNumber
        } = body;
        

        const cleanFullName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanphoneNumber = phoneNumber.trim();

        if (!cleanFullName) {
            return NextResponse.json(
                {message: "نام کاربری را وارد کنید"},
                {status: 422}
            );
        }

        if (cleanFullName.length < 3 || cleanFullName.length > 50) {
            return NextResponse.json(
                {message: "نام کاربری باید بین ۳ تا ۵۰ کاراکتر باشد"},
                {status: 422}
            );
        }

        if (!cleanEmail) {
            return NextResponse.json(
                {message: "ایمیل را وارد کنید"},
                {status: 422}
            );
        }

        const isValidEmail = validateEmail(cleanEmail);

        if (!isValidEmail) {
            return NextResponse.json(
                {message: "ایمیل معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        if (!password.trim()) {
            return NextResponse.json(
                {message: "رمز عبور را وارد کنید"},
                {status: 422}
            );
        }

        const isValidPassword = validatePassword(password);

        if (!isValidPassword) {
            return NextResponse.json(
                {message: "رمز عبور معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        if (!repeatPassword.trim()) {
            return NextResponse.json(
                {message: "تکرار رمز عبور را وارد کنید"},
                {status: 422}
            );
        }

        if (password !== repeatPassword) {
            return NextResponse.json(
                {message: "رمز عبور با تکرار آن برابر نیست"},
                {status: 422}
            );
        }

        if (!cleanphoneNumber) {
            return NextResponse.json(
                {message: "شماره تلفن را وارد کنید"},
                {status: 422}
            );
        }

        const isValidphoneNumber = validatePhone(cleanphoneNumber);

        if (!isValidphoneNumber) {
            return NextResponse.json(
                {message: "شماره تلفن معتبر نمی‌باشد"},
                {status: 422}
            );
        }

        const emailExists = await UserModel.findOne({
            email: cleanEmail
        });

        if (emailExists) {
            return NextResponse.json(
                {message: "این ایمیل قبلاً ثبت شده است"},
                {status: 409}
            );
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await UserModel.create({
            fullName: cleanFullName,
            email: cleanEmail,
            password: hashedPassword,
            phone: cleanphoneNumber,
        });


        const accessToken = generateAccessToken({userId: newUser._id.toString()});

        const refreshToken = generateRefreshToken({userId: newUser._id.toString()});

        const response = NextResponse.json(
            {
                message: "با موفقیت وارد شدید",
            },
            {
                status: 201,
            }
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

    }catch (error) {
        console.error(error);

        return NextResponse.json(
            {message: "خطایی در سرور رخ داد"},
            {status: 500}
        );
    }
}