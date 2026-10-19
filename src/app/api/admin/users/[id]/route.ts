import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import User from "@/models/User";

import {isValidObjectId} from "mongoose";
import {getCurrentUser} from "@/utility/getCurrentUser";
import UserBan from "@/models/UserBan";



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

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری خود شوید!",
                },
                {
                    status: 401,
                }
            );
        }

        if (currentUser.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "فقط مدیر امکان انجام این عملیات را دارد!",
                },
                {
                    status: 403,
                }
            );
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

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        if (user.role === "Admin") {
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
            email: user.email,
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
            email: user.email,
            phone: user.phone,
            reason: reason.trim(),
            bannedUntil: bannedUntil || null,
            bannedBy: currentUser._id,
            isActive: true,
        });

        user.status = "blocked";
        await user.save();

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

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری خود شوید!",
                },
                {
                    status: 401,
                }
            );
        }

        if (currentUser.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "فقط مدیر امکان انجام این عملیات را دارد!",
                },
                {
                    status: 403,
                }
            );
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

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        if (user.status === "active") {
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
                email: user.email,
                isActive: true,
            },
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        user.status = "active";
        await user.save();

        return NextResponse.json(
            {
                message: "کاربر با موفقیت از مسدودی خارج شد!",
                user,
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





export async function DELETE(
    req: NextRequest,
    {params}: Params
) {
    try {
        await connectToDB();

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری خود شوید!",
                },
                {
                    status: 401,
                }
            );
        }

        if (currentUser.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "فقط مدیر امکان انجام این عملیات را دارد!",
                },
                {
                    status: 403,
                }
            );
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

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        if (user.role === "Admin") {
            return NextResponse.json(
                {
                    message: "امکان حذف مدیر وجود ندارد!",
                },
                {
                    status: 403,
                }
            );
        }

        await User.findByIdAndDelete(id);

        await UserBan.deleteOne({
            email: user.email,
        });

        return NextResponse.json(
            {
                message: "کاربر با موفقیت حذف شد!",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("DELETE USER ERROR:", error);

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