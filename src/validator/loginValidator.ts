import { z } from "zod";

export const LoginValidator = z.object({
    email: z
        .string({
            error: "وارد کردن ایمیل الزامی می‌باشد",
        })
        .trim()
        .min(1, {
            error: "وارد کردن ایمیل الزامی می‌باشد",
        })
        .email({
            error: "فرمت ایمیل وارد شده معتبر نمی‌باشد",
        }),

    password: z
        .string({
            error: "وارد کردن رمز عبور الزامی می‌باشد",
        })
        .min(1, {
            error: "وارد کردن رمز عبور الزامی می‌باشد",
        }),
});
export const OtpLoginValidator = z.object({
    phoneNumber: z
        .string()
        .min(1, { error: "وارد کردن شماره موبایل الزامی می‌باشد" })
        .regex(/^09\d{9}$/, {
            error: "شماره موبایل باید ۱۱ رقم و با 09 شروع شود",
        }),
});



export type LoginFormValues = z.infer<typeof LoginValidator>;
export type OtpLoginFormValues = z.infer<typeof OtpLoginValidator>;