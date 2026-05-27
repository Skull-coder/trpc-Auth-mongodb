import { authOutputScehma } from "../base.schema.js"
import { z } from "zod"

export const loginInputSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character from @$!%*?&"),
})

export const loginOutputSchema = authOutputScehma.extend({ 
    data: z.object({
        id: z.string(),
        username: z.string(),
        email: z.string(),   
    })
})

export type LoginOutput = z.infer<typeof loginOutputSchema>
export type LoginInput = z.infer<typeof loginInputSchema>