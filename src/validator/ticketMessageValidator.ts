import { z } from "zod";
import {contactUsSchema} from "@/validator/contactUsValidator";

export const createTicketMessageSchema = z.strictObject({
    ticketId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "گفت و گوی مورد نظر یافت نشد",
    }),
    body: z.string({
        error: "متن تیکت باید رشته باشد",
    })
        .trim()
        .min(10, { error: "متن تیکت باید حداقل ۱۰ کاراکتر باشد" })
        .max(5000, { error: "متن تیکت نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد" }),
});
export const ticketMessageQuerySchema = z.strictObject({
    ticketId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه تیکت معتبر نیست",
    }),
});

export type TicketMessageFormValue = z.infer<typeof createTicketMessageSchema>;