import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Province from "@/models/Province";
import {checkRole} from "@/utility/checkRole";
import {createProvinceSchema} from "@/validator/provinceValidator";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const {response} = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }
        const body = await req.json().catch(() => null);

        const result = createProvinceSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    message: "اطلاعات ارسالی معتبر نیست",
                    errors: result.error.flatten().fieldErrors,
                },
                {status: 422}
            );
        }


        const {title, slug, cities} = result.data;


        const existingProvince = await Province.findOne({
            $or: [
                {title},
                {slug},
            ],
        });

        if (existingProvince) {
            return NextResponse.json(
                {
                    message: "این استان قبلاً ثبت شده است",
                },
                {
                    status: 409,
                }
            );
        }

        const province = await Province.create({
            title,
            slug,
            cities,
        });

        return NextResponse.json(
            {
                message: "استان با موفقیت ایجاد شد",
                province,
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

export async function GET() {
    try {
        await connectToDB();

        const {response} = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const provinces = await Province.find({
            isActive: true,
        })
            .select("_id title slug cities")
            .sort({
                title: 1,
            })
            .lean();

        return NextResponse.json(
            {
                provinces,
            },
            {
                status: 200,
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