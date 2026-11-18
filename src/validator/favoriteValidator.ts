import { z } from "zod";

export const favoriteSchema = z.strictObject({
    villaId: z.string().regex(/^[a-f\d]{24}$/i, {
        error: "شناسه ویلا معتبر نیست",
    }),
});