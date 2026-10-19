import {NextRequest, NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Province from "@/models/Province";
import {getCurrentUser} from "@/utility/getCurrentUser";

export async function POST(req: NextRequest) {
    try {
        await connectToDB();

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        if (user.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "شما دسترسی لازم برای این عملیات را ندارید",
                },
                {
                    status: 403,
                }
            );
        }

        const body = await req.json();

        const {title, slug, cities} = body;

        if (!title || !slug) {
            return NextResponse.json(
                {
                    message: "عنوان و slug استان الزامی است",
                },
                {
                    status: 400,
                }
            );
        }

        if (cities && !Array.isArray(cities)) {
            return NextResponse.json(
                {
                    message: "cities باید به صورت آرایه ارسال شود",
                },
                {
                    status: 400,
                }
            );
        }

        const existingProvince = await Province.findOne({
            $or: [
                {title: title.trim()},
                {slug: slug.trim()},
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
            title: title.trim(),
            slug: slug.trim(),
            cities: cities || [],
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

        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    message: "ابتدا وارد حساب کاربری شوید",
                },
                {
                    status: 401,
                }
            );
        }

        if (user.role !== "Admin") {
            return NextResponse.json(
                {
                    message: "شما دسترسی لازم را ندارید",
                },
                {
                    status: 403,
                }
            );
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