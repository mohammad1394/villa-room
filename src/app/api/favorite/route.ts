import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {verifyAccessToken} from "@/utility/auth";
import UserModel from "@/models/User";
import Villa from "@/models/Villa";
import Favorite from "@/models/Favorite";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();
        const {villaId} = body;

        if (!villaId) {
            return NextResponse.json(
                {
                    message: "لطفاً شناسه ویلا را وارد کنید",
                },
                {
                    status: 400,
                }
            );
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        const tokenPayload = verifyAccessToken(token);

        if (!tokenPayload) {
            return NextResponse.json(
                {
                    message: "احراز هویت نامعتبر است",
                },
                {
                    status: 401,
                }
            );
        }

        const user = await UserModel.findOne(
            {email: tokenPayload.email},
            "_id"
        );

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        const userId = user._id;

        const villa = await Villa.findById(villaId);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلا پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        const favorite = await Favorite.findOne({
            userId: user._id,
            villaId,
        });

        if (favorite) {
            await Favorite.deleteOne({
                _id: favorite._id,
            });

            return NextResponse.json(
                {
                    message: "ویلا از علاقه‌مندی‌ها حذف شد",
                    isFavorite: false,
                },
                { status: 200 }
            );
        }

        await Favorite.create({
            userId,
            villaId,
        });

        return NextResponse.json(
            {
                message: "ویلا با موفقیت به علاقه‌مندی‌ها اضافه شد",
                isFavorite: true,
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته سمت سرور رخ داده است",
            },
            {
                status: 500,
            }
        );
    }
}


export async function GET(){
    try{
        await connectToDB();

        const cookieStore = await cookies();

        const token = cookieStore.get("token")?.value;


        if (!token) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        const tokenPayload = verifyAccessToken(token);

        if (!tokenPayload) {
            return NextResponse.json(
                {
                    message: "احراز هویت نامعتبر است",
                },
                {
                    status: 401,
                }
            );
        }

        const user = await UserModel.findOne(
            {email: tokenPayload.email},
            "_id"
        );

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        const userId = user._id;

        const wishlist = await Favorite.find({userId}).populate("villaId");

        return NextResponse.json(wishlist);
    }catch(error){
        console.error(error);
        return NextResponse.json(
            {
                message: "خطای ناشناخته سمت سرور رخ داده است",
            },
            {
                status: 500,
            }
        )
    }
}