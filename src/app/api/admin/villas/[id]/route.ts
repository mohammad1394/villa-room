import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";

import { isValidObjectId } from "mongoose";
import { getCurrentUser } from "@/utility/getCurrentUser";

interface Params {
    params: Promise<{
        id: string;
    }>;
}




export async function PUT(
    req: NextRequest,
    { params }: Params
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
                    message: "فقط مدیر امکان ویرایش ویلا را دارد!",
                },
                {
                    status: 403,
                }
            );
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

        const body = await req.json();

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
        } = body;

        if (!title?.trim()) {
            return NextResponse.json(
                {
                    message: "عنوان ویلا را وارد کنید!",
                },
                {
                    status: 422,
                }
            );
        }

        if (!description?.trim()) {
            return NextResponse.json(
                {
                    message: "توضیحات ویلا را وارد کنید!",
                },
                {
                    status: 422,
                }
            );
        }

        villa.title = title.trim();
        villa.description = description.trim();
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
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("UPDATE VILLA ERROR:", error);

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