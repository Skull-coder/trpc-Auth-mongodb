import { t } from "./trpc.js";
import { TRPCError } from "@trpc/server";

export const globalErrorHandler = t.middleware(async ({ ctx, next, path }) => {
  try {
    return await next();
  } catch (error: any) {
    if (error instanceof TRPCError) {
      throw error;
    }

    if (error.name === "CastError") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid ID format provided in ${path}`,
      });
    }

    if (error.code === 11000) {
      // MongoDB Unique Constraint Violation
      throw new TRPCError({
        code: "CONFLICT",
        message: "A record with this data already exists",
      });
    }

    console.error(`[tRPC Error in ${path}]:`, error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected internal error occurred",
    });
  }
});
