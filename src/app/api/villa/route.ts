import { NextResponse} from "next/server";
import connectToDB from "@/config/db";
import Villa from "@/models/Villa";




export async function GET() {
    try {
        await connectToDB();

        const villas = await Villa.find({});

        return NextResponse.json(
            {
                villas,
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