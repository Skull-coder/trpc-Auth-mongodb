import { initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { createContext } from "./context.js";
import { authMiddleware } from "./server/middlewares/auth.middleware.js";
import type { Context } from "./context.js";

export const t = initTRPC.meta<OpenApiMeta>().context<Context>().create({
    errorFormatter({shape, error}){
        return {
            ...shape,
            data: {
                ...shape.data,
                success: false,
                code: error.code,
                message: error.message,
            }
        }
    }
});
export const router = t.router;