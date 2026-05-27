import { z } from "zod";
import { authOutputScehma } from "../base.schema.js";

export const getUserSchema = authOutputScehma.extend({ 
    data: z.object({
        id: z.string(),
        username: z.string(),
        email: z.string(),   
    })
})