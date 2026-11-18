
import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import { v2 as cloudinary } from "cloudinary";
import { checkRole } from "@/utility/checkRole";
import { createVillaSchema } from "@/validator/villaValidator";

export const runtime = "nodejs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
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
    });
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const { response } = await checkRole([
            "Admin",
            "SuperAdmin",
        ]);

        if (response) {
            return response;
        }

        const formData = await req.formData();


        const getValue = (key: string) => {
            const value = formData.get(key);

            if (
                value === null ||
                (typeof value === "string" && !value.trim())
            ) {
                return undefined;
            }

            return value;
        };

        const result = createVillaSchema.safeParse({
            title: getValue("title"),
            description: getValue("description"),
            type: getValue("type"),
            province: getValue("province"),
            city: getValue("city"),
            address: getValue("address"),
            pricePerNight: getValue("pricePerNight"),
            capacity: getValue("capacity"),
            bedrooms: getValue("bedrooms"),
            bathrooms: getValue("bathrooms"),
            amenities: formData.getAll("amenities"),
            images: formData.getAll("images").filter(
                (image): image is File => image instanceof File
            ),
        });

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
            pricePerNight,
            capacity,
            bedrooms,
            bathrooms,
            amenities,
            images,
        } = result.data;

        const imagePaths = await Promise.all(
            images.map((image) => uploadImage(image))
        );

        const newVilla = await Villa.create({
            title,
            description,
            type,
            province,
            city,
            address,
            pricePerNight,
            capacity,
            bedrooms,
            bathrooms,
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
                message: "خطای سرور رخ داده است، دوباره تلاش کنید",
            },
            { status: 500 }
        );
    }
}
