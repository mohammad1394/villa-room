import connectToDB from "@/config/db";
import {NextRequest, NextResponse} from "next/server";
import Villa from "@/models/Villa";
import Favorite from "@/models/Favorite";
import {checkRole} from "@/utility/checkRole";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const {user, response} = await checkRole(["User"]);

        if (response) {
            return response;
        }


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
            userId,
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


export async function GET() {
    try {
        await connectToDB();

        const {user, response} = await checkRole(["User"]);

        if (response) {
            return response;
        }

        const wishlist = await Favorite.find({
            userId: user._id,
        }).populate("villaId");

        return NextResponse.json(wishlist, {status: 200});
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
