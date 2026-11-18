
import { z } from "zod";

export const createProvinceSchema = z.strictObject({
    title: z.string({
        error: "عنوان استان باید رشته باشد",
    })
        .trim()
        .min(1, { error: "عنوان استان الزامی است" })
        .max(50, { error: "عنوان استان نباید بیشتر از ۵۰ کاراکتر باشد" }),

    slug: z.string({
        error: "slug باید رشته باشد",
    })
        .trim()
        .min(1, { error: "slug استان الزامی است" })
        .max(50, { error: "slug نباید بیشتر از ۵۰ کاراکتر باشد" })
        .regex(/^[a-z0-9-]+$/, {
            error: "slug فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد",
        }),

    cities: z.array(
        z.string()
            .trim()
            .min(1, { error: "نام شهر نمی‌تواند خالی باشد" })
            .max(50, { error: "نام شهر نباید بیشتر از ۵۰ کاراکتر باشد" })
    ).default([]),
});
