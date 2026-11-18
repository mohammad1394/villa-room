import { z } from "zod";

export const createTicketSchema = z.strictObject({
    title: z.string({
        error: "عنوان تیکت باید متن باشد",
    })
        .trim()
        .min(1, { error: "عنوان تیکت الزامی است" })
        .max(100, { error: "عنوان تیکت نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد" }),

    body: z.string({
        error: "متن تیکت باید رشته باشد",
    })
        .trim()
        .min(10, { error: "متن تیکت باید حداقل ۱۰ کاراکتر باشد" })
        .max(5000, { error: "متن تیکت نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد" }),

    department: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "دپارتمان انتخاب شده معتبر نیست",
    }),

    subDepartment: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "زیر دپارتمان انتخاب شده معتبر نیست",
    }),

    priority: z.enum(["low", "medium", "high"], {
        error: "اولویت تیکت معتبر نیست",
    }),
});



export const changeTicketStatusSchema = z.strictObject({
    ticketId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه نظر معتبر نیست",
    }),

    ticketStatus: z.enum(
        [
            "approved",
            "rejected",
        ],
        {
            error: "وضعیت وارد شده معتبر نیست",
        })
});