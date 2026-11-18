import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import User from "@/models/User";
import UserBan from "@/models/UserBan";
import {checkRole} from "@/utility/checkRole";
import {userBanSchema, userUnBanSchema} from "@/validator/userValidator";
import {Params} from "@/types/Params";



export async function POST(
    req: NextRequest,
    {params}: Params
) {
    try {
        await connectToDB();

        const { user, response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const {id} = await params;

        const body = await req.json().catch(() => null);

        const result = userBanSchema.safeParse({
            userId : id,
            reason : body?.resean,
            bannedUntil : body?.bannedUntil,
        })

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const {
            userId,
            reason,
            bannedUntil,
        } = result.data;

        const findUser = await User.findById(userId);

        if (!findUser) {
            return NextResponse.json(
                {
                    message: "کاربر با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        if (findUser.role === "Admin" || findUser.role === "SuperAdmin") {
            return NextResponse.json(
                {
                    message: "امکان مسدود کردن مدیر وجود ندارد!",
                },
                {
                    status: 403,
                }
            );
        }

        const existingBan = await UserBan.findOne({
            email: findUser.email,
            isActive: true,
        });

        if (existingBan) {
            return NextResponse.json(
                {
                    message: "این کاربر در حال حاضر مسدود است!",
                },
                {
                    status: 409,
                }
            );
        }

        const bannedUser = await UserBan.create({
            email: findUser.email,
            phone: findUser.phone,
            reason,
            bannedUntil,
            bannedBy: user._id,
            isActive: true,
        });

        findUser.status = "blocked";
        await findUser.save();

        return NextResponse.json(
            {
                message: "کاربر با موفقیت مسدود شد!",
                bannedUser,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("BAN USER ERROR:", error);

        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(
    req: NextRequest,
    {params}: Params
) {
    try {
        await connectToDB();

        const {  response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const {id} = await params;

        const result = userUnBanSchema.safeParse({
            userId : id,
        })

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const {userId} = result.data

        const findUser = await User.findById(userId);

        if (!findUser) {
            return NextResponse.json(
                {
                    message: "کاربر با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        if (findUser.status !== "blocked") {
            return NextResponse.json(
                {
                    message: "این کاربر در حال حاضر مسدود نیست!",
                },
                { status: 409 }
            );
        }



        const ban = await UserBan.findOneAndUpdate(
            {
                email: findUser.email,
                isActive: true,
            },
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        if (!ban) {
            return NextResponse.json(
                {
                    message: "رکورد مسدودی فعال برای این کاربر پیدا نشد!",
                },
                { status: 404 }
            );
        }

        findUser.status = "active";
        await findUser.save();

        return NextResponse.json(
            {
                message: "کاربر با موفقیت از مسدودی خارج شد!",
                findUser,
                ban,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            {
                status: 500,
            }
        );
    }
}