import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";
import path from "node:path";
import {writeFile} from "node:fs/promises";
import {getCurrentUser} from "@/utility/getCurrentUser";



export async function POST(req: NextRequest) {
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
            .filter((image): image is File => image instanceof File);

        if (
            !title ||
            !description ||
            !type ||
            !province ||
            !city ||
            !address ||
            bedrooms == null ||
            bathrooms == null ||
            capacity == null ||
            pricePerNight == null ||
            amenities.length === 0 ||
            images.length === 0
        ) {
            return NextResponse.json(
                {
                    message: "لطفاً تمام اطلاعات ضروری ویلا را وارد کنید",
                },
                {
                    status: 400,
                }
            );
        }

        const uploadDir = path.join(
            process.cwd(),
            "public",
            "uploads"
        );

        const imagePaths: string[] = [];

        for (const image of images) {
            const buffer = Buffer.from(await image.arrayBuffer());

            const fileName = `${Date.now()}-${image.name}`;

            const imagePath = path.join(uploadDir, fileName);

            await writeFile(imagePath, buffer);

            imagePaths.push(`/uploads/${fileName}`);
        }

        const newVilla = await Villa.create({
            title,
            description,
            type,
            province,
            city,
            address,
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
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message:
                    "خطای ناشناخته سمت سرور رخ داده است، دوباره تلاش کنید",
            },
            {
                status: 500,
            }
        );
    }
}