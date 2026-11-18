import { z } from "zod";

export const createReviewSchema = z.strictObject({
    villaId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه ویلا معتبر نیست",
    }),

    rating: z.number({
        error: "امتیاز باید عدد باشد",
    })
        .int({ error: "امتیاز باید عدد صحیح باشد" })
        .min(1, { error: "حداقل امتیاز ۱ است" })
        .max(5, { error: "حداکثر امتیاز ۵ است" }),

    comment: z.string()
        .trim()
        .min(10, { error: "نظر باید حداقل ۱۰ کاراکتر باشد" })
        .max(1000, { error: "نظر نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد" }),
});

export const reviewQuerySchema = z.object({
    villaId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه ویلا معتبر نیست",
    }),
});

export const changeReviewStatusSchema = z.strictObject({
    reviewId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه نظر معتبر نیست",
    }),

    reviewStatus: z.enum(
        [
            "approved",
            "rejected",
        ],
        {
            error: "وضعیت وارد شده معتبر نیست",
        })
});

