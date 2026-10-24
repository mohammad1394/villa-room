
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import { getCurrentUser } from "@/utility/getCurrentUser";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

function uploadImage(file: File): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const buffer = Buffer.from(await file.arrayBuffer());

            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "villa-room",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        if (!result?.secure_url) {
                            reject(new Error("Image upload failed"));
                            return;
                        }

                        resolve(result.secure_url);
                    }
                )
                .end(buffer);
        } catch (error) {
            reject(error);
        }
    });
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { message: "ابتدا وارد حساب کاربری خود شوید!" },
                { status: 401 }
            );
        }

        if (currentUser.role !== "Admin") {
            return NextResponse.json(
                { message: "فقط مدیر امکان ثبت ویلا را دارد!" },
                { status: 403 }
            );
        }

        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const type = formData.get("type");
        const province = formData.get("province");
        const city = formData.get("city");
        const address = formData.get("address");
        const pricePerNight = formData.get("pricePerNight");
        const capacity = formData.get("capacity");
        const bedrooms = formData.get("bedrooms");
        const bathrooms = formData.get("bathrooms");

        const amenities = formData.getAll("amenities");

        const images = formData
            .getAll("images")
            .filter(
                (image): image is File =>
                    image instanceof File && image.size > 0
            );

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof description !== "string" ||
            !description.trim() ||
            typeof type !== "string" ||
            !type ||
            typeof province !== "string" ||
            !province ||
            typeof city !== "string" ||
            !city.trim() ||
            typeof address !== "string" ||
            !address.trim() ||
            typeof pricePerNight !== "string" ||
            !pricePerNight.trim() ||
            typeof capacity !== "string" ||
            !capacity.trim() ||
            typeof bedrooms !== "string" ||
            !bedrooms.trim() ||
            typeof bathrooms !== "string" ||
            !bathrooms.trim() ||
            amenities.length === 0 ||
            !amenities.every(
                (item) => typeof item === "string" && item.trim()
            ) ||
            images.length === 0
        ) {
            return NextResponse.json(
                {
                    message: "لطفاً تمام اطلاعات ضروری ویلا را وارد کنید",
                },
                { status: 400 }
            );
        }

        if (images.length > MAX_IMAGES) {
            return NextResponse.json(
                { message: "حداکثر ۱۰ تصویر مجاز است" },
                { status: 400 }
            );
        }

        const numericFields = [
            Number(pricePerNight),
            Number(capacity),
            Number(bedrooms),
            Number(bathrooms),
        ];

        if (
            numericFields.some(
                (value) => !Number.isFinite(value) || value < 0
            ) ||
            Number(capacity) < 1 ||
            !Number.isInteger(Number(capacity)) ||
            !Number.isInteger(Number(bedrooms)) ||
            !Number.isInteger(Number(bathrooms))
        ) {
            return NextResponse.json(
                { message: "مقادیر قیمت، ظرفیت و اتاق‌ها معتبر نیستند" },
                { status: 400 }
            );
        }

        const invalidImage = images.find(
            (image) =>
                !allowedTypes.includes(image.type) ||
                image.size > MAX_FILE_SIZE
        );

        if (invalidImage) {
            return NextResponse.json(
                {
                    message:
                        "تصاویر باید JPEG، PNG یا WEBP و حداکثر ۵ مگابایت باشند",
                },
                { status: 400 }
            );
        }

        const imagePaths = await Promise.all(
            images.map((image) => uploadImage(image))
        );

        const newVilla = await Villa.create({
            title: title.trim(),
            description: description.trim(),
            type,
            province,
            city: city.trim(),
            address: address.trim(),
            pricePerNight: Number(pricePerNight),
            capacity: Number(capacity),
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            amenities,
            images: imagePaths,
        });

        return NextResponse.json(
            {
                message: "اطلاعات ویلا با موفقیت ثبت شد",
                villa: newVilla,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create villa error:", error);

        return NextResponse.json(
            {
                message:
                    "خطای سرور رخ داده است، دوباره تلاش کنید",
            },
            { status: 500 }
        );
    }
}
