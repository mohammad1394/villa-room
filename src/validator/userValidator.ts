import {z} from "zod"

export const userBanSchema = z.strictObject({
    userId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه کاربر معتبر نیست",
    }),

    reason: z.string({
        error: "علت مسدودی باید متن باشد",
    })
        .trim()
        .min(10, { error: "علت مسدودی باید حداقل ۱۰ کاراکتر باشد" })
        .max(200, { error: "علت مسدودی نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد" }),

    bannedUntil: z.iso.datetime({
        error: "تاریخ انقضای بن معتبر نیست",
    })
        .refine((value : string) => new Date(value) > new Date(), {
            error: "تاریخ انقضای بن باید در آینده باشد",
        })
        .transform((value : string) => new Date(value)),
});


export const userUnBanSchema = z.strictObject({
    userId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه کاربر معتبر نیست",
    })
});

export const updateProfileSchema = z.strictObject({
    fullName: z
        .string({
            error: "نام باید به‌صورت متن ارسال شود",
        })
        .trim()
        .min(3, "نام شما باید حداقل ۳ کاراکتر باشد")
        .max(50, "نام شما نباید بیشتر از ۵۰ کاراکتر باشد"),

    email: z
        .string({
            error: "ایمیل باید به‌صورت متن ارسال شود",
        })
        .trim()
        .toLowerCase()
        .min(1, "ایمیل را وارد کنید")
        .email("ایمیل معتبر نمی‌باشد"),
});


export type UpadatedProfileFormValues = z.infer<typeof updateProfileSchema>