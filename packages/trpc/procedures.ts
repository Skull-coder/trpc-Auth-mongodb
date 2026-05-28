import { t } from "./trpc.js";
import { authMiddleware } from "./server/middlewares/auth.middleware.js";
import { globalErrorHandler } from "./server/middlewares/globalErrorHandler.js";

// Public Procedure: No auth required
export const publicProcedure = t.procedure.use(globalErrorHandler);

export const authenticatedProcedure = t.procedure.use(authMiddleware).use(globalErrorHandler);