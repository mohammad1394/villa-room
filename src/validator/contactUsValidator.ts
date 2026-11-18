import { z } from "zod";

export const contactUsSchema = z.object({
    fullName: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "وارد کردن نام الزامی می‌باشد"
                    : "نام باید متن باشد",
        })
        .trim()
        .min(3, { error: "نام باید حداقل ۳ کاراکتر باشد" })
        .max(50, {
            error: "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد",
        }),

    email: z
        .string({
            error: "وارد کردن ایمیل الزامی می‌باشد",
        })
        .trim()
        .min(1, { error: "وارد کردن ایمیل الزامی می‌باشد" })
        .email({ error: "فرمت ایمیل وارد شده معتبر نمی‌باشد" })
        .transform((value) => value.toLowerCase()),

    phone: z
        .string({
            error: "وارد کردن شماره موبایل الزامی می‌باشد",
        })
        .trim()
        .min(1, { error: "وارد کردن شماره موبایل الزامی می‌باشد" })
        .regex(/^09\d{9}$/, {
            error: "شماره موبایل باید ۱۱ رقم و با 09 شروع شود",
        }),

    subject: z.enum(
        [
            "reservation",
            "my-payment",
            "support",
            "complaint",
            "other",
        ],
        {
            error: "موضوع وارد شده معتبر نیست",
        }
    ),

    message: z
        .string({
            error: "متن پیام خود را وارد کنید",
        })
        .trim()
        .min(10, {
            error: "متن پیام باید حداقل ۱۰ کاراکتر باشد",
        }),
}).strict();

export type ContactUsValues = z.infer<typeof contactUsSchema>;