
import { z } from "zod";

export const RegisterValidator = z
    .object({
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

        phoneNumber: z
            .string({
                error: "وارد کردن شماره موبایل الزامی می‌باشد",
            })
            .min(1, { error: "وارد کردن شماره موبایل الزامی می‌باشد" })
            .regex(/^09\d{9}$/, {
                error: "شماره موبایل باید ۱۱ رقم و با 09 شروع شود",
            }),

        email: z
            .string({
                error: "وارد کردن ایمیل الزامی می‌باشد",
            })
            .trim()
            .min(1, { error: "وارد کردن ایمیل الزامی می‌باشد" })
            .email({ error: "فرمت ایمیل وارد شده معتبر نمی‌باشد" }),

        password: z
            .string({
                error: "وارد کردن رمز عبور الزامی می‌باشد",
            })
            .min(1, { error: "وارد کردن رمز عبور الزامی می‌باشد" })
            .min(8, {
                error: "رمز عبور باید حداقل ۸ کاراکتر باشد",
            })
            .regex(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).+$/,
                {
                    error:
                        "رمز عبور باید شامل حروف بزرگ، کوچک، عدد و کاراکتر خاص باشد",
                }
            ),

        repeatPassword: z
            .string({
                error: "تکرار رمز عبور الزامی می‌باشد",
            })
            .min(1, {
                error: "تکرار رمز عبور الزامی می‌باشد",
            }),

        terms: z.boolean().refine((value) => value, {
            error: "برای ثبت‌نام باید قوانین و مقررات را بپذیرید",
        }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "رمز عبور و تکرار آن یکسان نیستند",
        path: ["repeatPassword"],
    });

export type RegisterFormValues = z.infer<typeof RegisterValidator>;
