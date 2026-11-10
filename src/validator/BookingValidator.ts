import { z } from "zod";

export const BookingValidator = z
    .object({
        checkIn: z.date({
            error: "انتخاب تاریخ ورود الزامی است",
        }),

        checkOut: z.date({
            error: "انتخاب تاریخ خروج الزامی است",
        }),

        guests: z
            .number({
                error: "تعداد مهمان‌ها الزامی است",
            })
            .int({ error: "تعداد مهمان‌ها باید عدد صحیح باشد" })
            .min(1, { error: "حداقل یک مهمان باید انتخاب شود" })
            .max(20, { error: "حداکثر تعداد مهمان‌ها ۲۰ نفر است" }),

        fullName: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "وارد کردن نام الزامی است"
                        : "نام باید متن باشد",
            })
            .trim()
            .min(3, { error: "نام باید حداقل ۳ کاراکتر باشد" })
            .max(50, {
                error: "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد",
            }),

        phoneNumber: z
            .string({
                error: "وارد کردن شماره موبایل الزامی است",
            })
            .trim()
            .min(1, { error: "وارد کردن شماره موبایل الزامی است" })
            .regex(/^09\d{9}$/, {
                error: "شماره موبایل باید ۱۱ رقم و با 09 شروع شود",
            }),

        description: z
            .string()
            .max(300, {
                error: "متن توضیحات نمی‌تواند بیشتر از ۳۰۰ کاراکتر باشد",
            })
            .optional()
            .default(""),
    })
    .refine((data) => data.checkOut > data.checkIn, {
        message: "تاریخ خروج باید بعد از تاریخ ورود باشد",
        path: ["checkOut"],
    })
    .refine((data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkIn = new Date(data.checkIn);
        checkIn.setHours(0, 0, 0, 0);

        return checkIn >= today;
    }, {
        message: "تاریخ ورود نمی‌تواند در گذشته باشد",
        path: ["checkIn"],
    });

export type BookingFormValues = z.infer<typeof BookingValidator>;