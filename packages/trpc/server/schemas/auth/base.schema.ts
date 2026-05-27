import {z} from "zod"

export const authOutputScehma = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        id: z.string(),
        username: z.string(),
        email: z.email(),
    }).optional()
})