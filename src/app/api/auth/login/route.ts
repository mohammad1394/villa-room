import {NextRequest , NextResponse} from "next/server";
import connectToDB from "@/config/db";
import {generateAccessToken, generateRefreshToken, validateEmail, verifyPassword} from "@/utility/auth";
import UserModel from "@/models/User";

export async function POST(req : NextRequest){
    try {
        await connectToDB();

        const {email , password } = await req.json();

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            return NextResponse.json(
                { message: "ایمیل را وارد کنید" },
                { status: 422 }
            );
        }

        const isValidEmail = validateEmail(cleanEmail);

        if (!isValidEmail) {
            return NextResponse.json(
                { message: "ایمیل معتبر نمی‌باشد" },
                { status: 422 }
            );
        }

        const user = await UserModel.findOne({email : cleanEmail});




        if (!user) {
            return NextResponse.json({message : "کاربری با ایمیل مورد نظر یافت نشد "} , {status : 404});
        }

        if (!password.trim()) {
            return NextResponse.json(
                { message: "رمز عبور را وارد کنید" },
                { status: 422 }
            );
        }

        const comparePassword = await verifyPassword(password , user.password);

        if (!comparePassword) {
            return NextResponse.json({message : "ایمیل یا رمز کاربری صحیح نمیباشد"} , {status : 422});
        }

        const accessToken = generateAccessToken({email});

        const refreshToken = generateRefreshToken({email});

        await UserModel.findOneAndUpdate({email} , {
            $set : {
                refreshToken : refreshToken
            }
        })

        const response = NextResponse.json(
            {
                message: "با موفقیت وارد شدید",
            },
            {
                status: 200,
            }
        );

        response.cookies.set("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        return response;

    }
    catch(err){
        console.log("login error =>" ,  err)

        return NextResponse.json(
            {message: "خطایی در سرور رخ داد"},
            {status: 500}
        );
    }
}