
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 5;

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const villaInfoQuerySchema = z.strictObject({
    villaId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه ویلا معتبر نیست",
    }),
});

export const createVillaSchema = z.strictObject({
    title: z.string()
        .trim()
        .min(1, { error: "عنوان ویلا الزامی است" })
        .max(100, { error: "عنوان ویلا نباید بیشتر از ۱۰۰ کاراکتر باشد" }),

    description: z.string()
        .trim()
        .min(10, { error: "توضیحات ویلا باید حداقل ۱۰ کاراکتر باشد" })
        .max(5000, { error: "توضیحات ویلا نباید بیشتر از ۵۰۰۰ کاراکتر باشد" }),

    type: z.enum(["forest", "beach", "pool", "mountain"], {
        error: "نوع ویلا معتبر نیست",
    }),

    province: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه استان معتبر نیست",
    }),

    city: z.string()
        .trim()
        .min(1, { error: "نام شهر الزامی است" })
        .max(50, { error: "نام شهر نباید بیشتر از ۵۰ کاراکتر باشد" }),

    address: z.string()
        .trim()
        .min(1, { error: "آدرس ویلا الزامی است" })
        .max(500, { error: "آدرس ویلا نباید بیشتر از ۵۰۰ کاراکتر باشد" }),

    pricePerNight: z.coerce.number()
        .min(1, { error: "قیمت هر شب باید بیشتر از صفر باشد" }),

    capacity: z.coerce.number()
        .int({ error: "ظرفیت باید عدد صحیح باشد" })
        .min(1, { error: "ظرفیت حداقل باید ۱ نفر باشد" }),

    bedrooms: z.coerce.number()
        .int({ error: "تعداد اتاق خواب باید عدد صحیح باشد" })
        .min(0, { error: "تعداد اتاق خواب نمی‌تواند منفی باشد" }),

    bathrooms: z.coerce.number()
        .int({ error: "تعداد حمام باید عدد صحیح باشد" })
        .min(0, { error: "تعداد حمام نمی‌تواند منفی باشد" }),

    amenities: z.array(
        z.string().trim().min(1, {
            error: "نام امکان نمی‌تواند خالی باشد",
        })
    ).min(1, {
        error: "حداقل یک امکان برای ویلا انتخاب کنید",
    }),

    images: z.array(
        z.file()
            .max(MAX_FILE_SIZE, {
                error: "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد",
            })
            .mime(allowedTypes, {
                error: "فرمت تصویر باید JPEG، PNG یا WEBP باشد",
            })
    )
        .min(1, { error: "حداقل یک تصویر برای ویلا انتخاب کنید" })
        .max(MAX_IMAGES, { error: "حداکثر ۵ تصویر مجاز است" }),
});

export type CreateVillaFormValues = z.input<typeof createVillaSchema>;
export type CreateVillaFormOutput = z.output<typeof createVillaSchema>;

export const updateVillaSchema = z.strictObject({
    title: z.string()
        .trim()
        .min(1, { error: "عنوان ویلا الزامی است" })
        .max(100),

    description: z.string()
        .trim()
        .min(10, { error: "توضیحات ویلا باید حداقل ۱۰ کاراکتر باشد" })
        .max(5000),

    type: z.enum(["forest", "beach", "pool", "mountain"]),

    province: z.string().regex(/^[a-f\d]{24}$/i),

    city: z.string().trim().min(1).max(50),

    address: z.string().trim().min(1).max(500),

    images: z.array(z.url())
        .min(1)
        .max(10),

    pricePerNight: z.number().finite().min(0),

    capacity: z.number().int().min(1),

    bedrooms: z.number().int().min(0),

    bathrooms: z.number().int().min(0),

    amenities: z.array(z.string().trim().min(1)).min(1),
});

export const createVillaBanSchema = z.strictObject({
    reason: z.string()
        .trim()
        .min(10, {
            error: "علت مسدودی باید حداقل ۱۰ کاراکتر باشد",
        })
        .max(200, {
            error: "علت مسدودی نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد",
        }),

    bannedUntil: z.iso.datetime()
        .refine((value) => new Date(value) > new Date(), {
            error: "تاریخ انقضای مسدودی باید در آینده باشد",
        })
        .transform((value) => new Date(value))
        .nullable()
        .optional(),
});
