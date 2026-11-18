import { z } from "zod";

export const createDiscountSchema = z.strictObject({
    code: z.string({
        error: "کد تخفیف باید رشته باشد",
    })
        .trim()
        .min(1, { error: "کد تخفیف را وارد کنید" })
        .max(30, { error: "کد تخفیف نمی‌تواند بیشتر از ۳۰ کاراکتر باشد" })
        .transform((value) => value.toUpperCase()),

    villaId: z.string()
        .regex(/^[a-f\d]{24}$/i, {
            error: "شناسه ویلا معتبر نمی‌باشد",
        }),

    maxUse: z.number({
        error: "تعداد استفاده مجاز باید عدد باشد",
    })
        .int({ error: "تعداد استفاده مجاز باید عدد صحیح باشد" })
        .min(1, { error: "تعداد استفاده مجاز باید حداقل ۱ باشد" }),

    expire: z.iso.datetime({
        error: "تاریخ انقضای کد تخفیف معتبر نمی‌باشد",
    })
        .refine((value) => new Date(value) > new Date(), {
            error: "تاریخ انقضا باید در آینده باشد",
        })
        .transform((value) => new Date(value)),

    percent: z.number({
        error: "درصد تخفیف باید عدد باشد",
    })
        .int({ error: "درصد تخفیف باید عدد صحیح باشد" })
        .min(1, { error: "حداقل درصد تخفیف ۱ است" })
        .max(100, { error: "حداکثر درصد تخفیف ۱۰۰ است" }),
});

export type DiscountFormInput = z.input<typeof createDiscountSchema>;

export type DiscountFormOutput = z.output<typeof createDiscountSchema>;