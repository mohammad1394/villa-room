import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import User from "@/models/User";

import {isValidObjectId} from "mongoose";
import {getCurrentUser} from "@/utility/getCurrentUser";
import UserBan from "@/models/UserBan";
import {checkRole} from "@/utility/checkRole";



interface Params {
    params: Promise<{
        id: string;
    }>;
}

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

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه کاربر معتبر نمی‌باشد!",
                },
                {
                    status: 422,
                }
            );
        }

        const body = await req.json();

        const {
            reason,
            bannedUntil,
        } = body;

        if (!reason?.trim()) {
            return NextResponse.json(
                {
                    message: "علت مسدود کردن کاربر را وارد کنید!",
                },
                {
                    status: 422,
                }
            );
        }

        const findUser = await User.findById(id);

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
            reason: reason.trim(),
            bannedUntil: bannedUntil || null,
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

        const { user, response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const {id} = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه کاربر معتبر نمی‌باشد!",
                },
                {
                    status: 422,
                }
            );
        }

        const findUser = await User.findById(id);

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

        if (findUser.status === "active") {
            return NextResponse.json(
                {
                    message: "این کاربر در حال حاضر فعال است!",
                },
                {
                    status: 409,
                }
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
        console.error("UNBAN USER ERROR:", error);

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