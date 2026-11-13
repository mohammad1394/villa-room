import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import { isValidObjectId } from "mongoose";
import { getCurrentUser } from "@/utility/getCurrentUser";
import VillaBan from "@/models/VillaBan";
import {checkRole} from "@/utility/checkRole";

interface Params {
    params: Promise<{
        id: string;
    }>;
}



export async function POST(
    req: NextRequest,
    { params }: Params
) {
    try {
        await connectToDB();

        const { user, response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نمی‌باشد!",
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
                    message: "علت مسدود کردن ویلا را وارد کنید!",
                },
                {
                    status: 422,
                }
            );
        }

        const villa = await Villa.findById(id);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        const existingVillaBan = await VillaBan.findOne({
            villaId: id,
            isActive: true,
        });

        if (existingVillaBan) {
            return NextResponse.json(
                {
                    message: "این ویلا در حال حاضر مسدود است!",
                },
                {
                    status: 409,
                }
            );
        }

        const bannedVilla = await VillaBan.create({
            villaId: villa._id,
            reason: reason.trim(),
            bannedUntil: bannedUntil || null,
            bannedBy: user._id,
            isActive: true,
        });

        villa.isActive = false;
        await villa.save();

        return NextResponse.json(
            {
                message: "ویلا با موفقیت مسدود شد!",
                bannedVilla,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("BAN VILLA ERROR:", error);

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
    request: NextRequest,
    { params }: Params
) {
    try {
        await connectToDB();

        const { response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نمی‌باشد!",
                },
                {
                    status: 422,
                }
            );
        }

        const villa = await Villa.findById(id);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        if (villa.isActive) {
            return NextResponse.json(
                {
                    message: "این ویلا در حال حاضر فعال است!",
                },
                {
                    status: 409,
                }
            );
        }

        const villaBan = await VillaBan.findOneAndUpdate(
            {
                villaId: villa._id,
                isActive: true,
            },
            {
                isActive: false,
            },
            {
                new: true,
            }
        );

        if (!villaBan) {
            return NextResponse.json(
                {
                    message: "مسدودی فعالی برای این ویلا پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        villa.isActive = true;
        await villa.save();

        return NextResponse.json(
            {
                message: "ویلا با موفقیت از مسدودی خارج شد!",
                villaBan,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("UNBAN VILLA ERROR:", error);

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
    { params }: Params
) {
    try {
        await connectToDB();

        const { response } = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }


        const { id } = await params;

        if (!isValidObjectId(id)) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نمی‌باشد!",
                },
                {
                    status: 422,
                }
            );
        }

        const villa = await Villa.findById(id);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                {
                    status: 404,
                }
            );
        }

        await Villa.findByIdAndDelete(id);

        await VillaBan.deleteMany({
            villaId: villa._id,
        });

        return NextResponse.json(
            {
                message: "ویلا با موفقیت حذف شد!",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("DELETE VILLA ERROR:", error);

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