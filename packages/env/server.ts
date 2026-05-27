import {z} from "zod"

export const envServerSchema = z.object({
    PORT: z.string().default("4000"),
    MONGODB_URI: z.string().default("mongodb://localhost:27017/backend"),
    FRONTEND_URL: z.string().default("http://localhost:5174"),
    ACCESS_TOKEN: z.string().default("AUTH_ACCESS_TOKEN"),
    REFRESH_TOKEN: z.string().default("AUTH_REFRESH_TOKEN"),
    JWT_SECRET: z.string().default("bguya12fdwuy13@#wqaudvyqHGHgghc@123424vfy"),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
})

export const envServer = envServerSchema.parse(process.env)