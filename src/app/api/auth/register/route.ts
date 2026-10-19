import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import {generateAccessToken, hashPassword, validateEmail, validatePassword, validatePhone} from "@/utility/auth";
import UserModel from "@/models/User"


export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const body = await req.json();
        const {formData} = body;

        const {
            fullName,
            email,
            password,
            confirmPassword,
            phone
        } = formData;

        const cleanFullName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

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

        if (!confirmPassword.trim()) {
            return NextResponse.json(
                {message: "تکرار رمز عبور را وارد کنید"},
                {status: 422}
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                {message: "رمز عبور با تکرار آن برابر نیست"},
                {status: 422}
            );
        }

        if (!cleanPhone) {
            return NextResponse.json(
                {message: "شماره تلفن را وارد کنید"},
                {status: 422}
            );
        }

        const isValidPhone = validatePhone(cleanPhone);

        if (!isValidPhone) {
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

        const users = await UserModel.find({});

        await UserModel.create({
            fullName: cleanFullName,
            email: cleanEmail,
            password: hashedPassword,
            phone: cleanPhone,
            role: users.length > 0 ? "User" : "Admin"
        });

        const accessToken = generateAccessToken({email})
        return NextResponse.json(
            {message: "کاربر با موفقیت ثبت نام شد"},
            {
                status: 201,
                headers: {
                    "set-Cookie": `token = ${accessToken};path=/;httpOnly= true`
                }
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {message: "خطایی در سرور رخ داد"},
            {status: 500}
        );
    }
}