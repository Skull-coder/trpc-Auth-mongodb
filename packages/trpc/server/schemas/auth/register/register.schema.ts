import {z} from "zod"
import {authOutputScehma} from "../base.schema.js"

export const registerInputSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(50, "Username must be at most 50 characters long").lowercase().trim(),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character from @$!%*?&"),
})

export const registerOutputSchema = authOutputScehma.extend({ 
    data: z.object({
        id: z.string(),
        username: z.string(),
        email: z.email(),
    })
})

export type RegisterInput = z.infer<typeof registerInputSchema>
export type RegisterOutput = z.infer<typeof registerOutputSchema>