import { z } from "zod";

export const BookingFormSchema = z
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

const bookingDateSchema = z
    .string()
    .trim()
    .superRefine((value, ctx) => {
        const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

        const isDateTime =
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/.test(value);

        if (!isDateOnly && !isDateTime) {
            ctx.addIssue({
                code: "custom",
                message: "فرمت تاریخ معتبر نیست",
            });
            return;
        }

        const date = new Date(
            isDateOnly ? `${value}T00:00:00.000Z` : value
        );

        if (Number.isNaN(date.getTime())) {
            ctx.addIssue({
                code: "custom",
                message: "تاریخ وارد شده معتبر نیست",
            });
            return;
        }

        if (
            isDateOnly &&
            date.toISOString().slice(0, 10) !== value
        ) {
            ctx.addIssue({
                code: "custom",
                message: "تاریخ وارد شده معتبر نیست",
            });
        }
    })
    .transform((value) => {
        return new Date(
            /^\d{4}-\d{2}-\d{2}$/.test(value)
                ? `${value}T00:00:00.000Z`
                : value
        );
    });

const getUtcDay = (date: Date) =>
    Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
    );

export const bookingApiSchema = z
    .object({
        villaId: z
            .string()
            .regex(
                /^[0-9a-fA-F]{24}$/,
                "شناسه ویلا معتبر نیست"
            ),

        checkIn: bookingDateSchema,

        checkOut: bookingDateSchema,

        guests: z
            .union([
                z.number(),
                z.string().regex(/^\d+$/).transform(Number),
            ])
            .pipe(
                z
                    .number()
                    .int("تعداد مهمان‌ها باید عدد صحیح باشد")
                    .min(1, "حداقل یک مهمان باید انتخاب شود")
            ),
        fullName: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "وارد کردن نام الزامی می‌باشد"
                        : "نام باید متن باشد",
            })
            .trim()
            .min(3, {error: "نام باید حداقل ۳ کاراکتر باشد"})
            .max(50, {
                error: "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد",
            }),
        phoneNumber: z
            .string({
                error: "وارد کردن شماره موبایل الزامی می‌باشد",
            })
            .min(1, {error: "وارد کردن شماره موبایل الزامی می‌باشد"})
            .regex(/^09\d{9}$/, {
                error: "شماره موبایل باید ۱۱ رقم و با 09 شروع شود",
            }),

    })
    .strict()
    .superRefine((data, ctx) => {
        const checkInDay = getUtcDay(data.checkIn);
        const checkOutDay = getUtcDay(data.checkOut);

        if (checkOutDay <= checkInDay) {
            ctx.addIssue({
                code: "custom",
                path: ["checkOut"],
                message: "تاریخ خروج باید بعد از تاریخ ورود باشد",
            });

            return;
        }

        const todayDay = getUtcDay(new Date());

        if (checkInDay < todayDay) {
            ctx.addIssue({
                code: "custom",
                path: ["checkIn"],
                message: "تاریخ ورود نمی‌تواند در گذشته باشد",
            });
        }

        const nights = Math.round(
            (checkOutDay - checkInDay) /
            (1000 * 60 * 60 * 24)
        );

        if (nights < 2) {
            ctx.addIssue({
                code: "custom",
                path: ["checkOut"],
                message: "حداقل مدت اقامت ۲ شب است",
            });
        }
    });

export const bookingChangeStatusSchema = z.strictObject({

    bookingId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه رزرو معتبر نیست",
    }),

    bookingStatus: z.enum(
        [
            "pending",
            "confirmed",
            "cancelled",
            "completed",
        ],
        {
            error: "وضعیت وارد شده معتبر نیست",
        })
})


export const bookingCardSchema = z.object({
    checkIn: z.iso.date({
        error: "تاریخ ورود را انتخاب کنید",
    }),

    checkOut: z.iso.date({
        error: "تاریخ خروج را انتخاب کنید",
    }),

    guests: z.number({
        error: "تعداد مهمانان باید عدد باشد",
    })
        .int("تعداد مهمانان باید عدد صحیح باشد")
        .min(1, "حداقل یک مهمان باید انتخاب کنید"),
}).refine(
    (data) => data.checkOut > data.checkIn,
    {
        error: "تاریخ خروج باید بعد از تاریخ ورود باشد",
        path: ["checkOut"],
    }
);




export type BookingCardFormData = z.infer<typeof bookingCardSchema>;
export type BookingFormValues = z.infer<typeof BookingFormSchema>;