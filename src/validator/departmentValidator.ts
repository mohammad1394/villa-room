import { z } from "zod";

export const DepartmentSchema = z.strictObject({
    title: z.string()
        .trim()
        .min(1, { error: "عنوان دپارتمان الزامی است" })
        .max(50, { error: "عنوان دپارتمان نباید بیشتر از ۵۰ کاراکتر باشد" }),
});

export const SubDepartmentSchema = z.strictObject({
    title: z.string()
        .trim()
        .min(1, { error: "عنوان زیر دپارتمان الزامی است" })
        .max(50, { error: "عنوان زیر دپارتمان نباید بیشتر از ۵۰ کاراکتر باشد" }),

    department: z.string()
        .regex(/^[a-f\d]{24}$/i, {
            error: "شناسه دپارتمان معتبر نیست",
        }),
});

export const departmentIdSchema = z.strictObject({
    id: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه دپارتمان معتبر نیست",
    }),
});