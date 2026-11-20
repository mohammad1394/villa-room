import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import VillaBan from "@/models/VillaBan";
import {checkRole} from "@/utility/checkRole";
import {createVillaBanSchema, villaInfoQuerySchema} from "@/validator/villaValidator";

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

        const { user, response } = await checkRole([
            "Admin",
            "SuperAdmin",
        ]);

        if (response) {
            return response;
        }

        const { id } = await params;

        const idResult = villaInfoQuerySchema.safeParse({ id });

        if (!idResult.success) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نمی‌باشد!",
                    errors: idResult.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const body = await req.json().catch(() => null);

        const result = createVillaBanSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات وارد شده معتبر نیست!",
                    errors: result.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const { reason, bannedUntil } = result.data;

        const villa = await Villa.findById(id);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                { status: 404 }
            );
        }

        const existingVillaBan = await VillaBan.findOne({
            villaId: villa._id,
            isActive: true,
        });

        if (existingVillaBan) {
            return NextResponse.json(
                {
                    message: "این ویلا در حال حاضر مسدود است!",
                },
                { status: 409 }
            );
        }

        const bannedVilla = await VillaBan.create({
            villaId: villa._id,
            reason,
            bannedUntil: bannedUntil ?? null,
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
            { status: 201 }
        );
    } catch (error) {


        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    req : NextRequest,
    { params }: Params
) {
    try {
        await connectToDB();

        const { response } = await checkRole([
            "Admin",
            "SuperAdmin",
        ]);

        if (response) {
            return response;
        }

        const { id } = await params;

        const idResult = villaInfoQuerySchema.safeParse({ id });

        if (!idResult.success) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نمی‌باشد!",
                    errors: idResult.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const villa = await Villa.findById(id);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                { status: 404 }
            );
        }

        if (villa.isActive) {
            return NextResponse.json(
                {
                    message: "این ویلا در حال حاضر فعال است!",
                },
                { status: 409 }
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
                { status: 404 }
            );
        }

        villa.isActive = true;
        await villa.save();

        return NextResponse.json(
            {
                message: "ویلا با موفقیت از مسدودی خارج شد!",
                villaBan,
            },
            { status: 200 }
        );
    } catch (error) {


        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            { status: 500 }
        );
    }
}

// DELETE: Delete Villa
export async function DELETE(
    req : NextRequest,
    { params }: Params
) {
    try {
        await connectToDB();

        const { response } = await checkRole([
            "Admin",
            "SuperAdmin",
        ]);

        if (response) {
            return response;
        }

        const { id } = await params;

        const idResult = villaInfoQuerySchema.safeParse({ id });

        if (!idResult.success) {
            return NextResponse.json(
                {
                    message: "شناسه ویلا معتبر نمی‌باشد!",
                    errors: idResult.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const villa = await Villa.findById(id);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                { status: 404 }
            );
        }

        await VillaBan.deleteMany({
            villaId: villa._id,
        });

        await Villa.findByIdAndDelete(villa._id);

        return NextResponse.json(
            {
                message: "ویلا با موفقیت حذف شد!",
            },
            { status: 200 }
        );
    } catch (error) {


        return NextResponse.json(
            {
                message: "خطای ناشناخته‌ای در سمت سرور رخ داده است!",
            },
            { status: 500 }
        );
    }
}
