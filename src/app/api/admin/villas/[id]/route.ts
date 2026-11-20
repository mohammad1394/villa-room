
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import { checkRole } from "@/utility/checkRole";
import {
    villaInfoQuerySchema,
    updateVillaSchema,
} from "@/validator/villaValidator";
import {Params} from "@/types/Params";


export async function PUT(
    req: NextRequest,
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
                    message: "شناسه ویلا معتبر نیست",
                    errors: idResult.error.flatten().fieldErrors,
                },
                { status: 422 }
            );
        }

        const { villaId } = idResult.data;


        const villa = await Villa.findById(villaId);

        if (!villa) {
            return NextResponse.json(
                {
                    message: "ویلایی با این شناسه پیدا نشد!",
                },
                { status: 404 }
            );
        }

        const body = await req.json().catch(() => null);

        const result = updateVillaSchema.safeParse(body);

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
            title,
            description,
            type,
            province,
            city,
            address,
            images,
            pricePerNight,
            capacity,
            bedrooms,
            bathrooms,
            amenities,
        } = result.data;


        villa.title = title;
        villa.description = description;
        villa.type = type;
        villa.province = province;
        villa.city = city;
        villa.address = address;
        villa.images = images;
        villa.pricePerNight = pricePerNight;
        villa.capacity = capacity;
        villa.bedrooms = bedrooms;
        villa.bathrooms = bathrooms;
        villa.amenities = amenities;

        await villa.save();

        return NextResponse.json(
            {
                message: "اطلاعات ویلا با موفقیت ویرایش شد!",
                villa,
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
