import connectToDB from "@/config/db";
import {NextResponse} from "next/server";
import Review from "@/models/Review";
import {checkRole} from "@/utility/checkRole";
import {changeReviewStatusSchema} from "@/validator/reviewValidator";

export async function PATCH(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDB();

        const {response} = await checkRole(["Admin", "SuperAdmin"]);

        if (response) {
            return response;
        }

        const { id } = await params;

        const body = await request.json().catch(() => null);

        const result = changeReviewStatusSchema.safeParse({
            reviewId: id,
            reviewStatus: body?.status,
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

        const { reviewId, reviewStatus } = result.data;

        const review = await Review.findById(reviewId);

        if (!review) {
            return NextResponse.json(
                { message: "کامنت پیدا نشد." },
                { status: 404 }
            );
        }

        review.status = reviewStatus;

        await review.save();

        return NextResponse.json(
            {
                message: "وضعیت کامنت با موفقیت تغییر کرد.",
                review,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        return NextResponse.json(
            {
                message: "خطایی در تغییر وضعیت کامنت رخ داد.",
            },
            {
                status: 500,
            }
        );
    }
}