import { t } from "./trpc.js";
import { authMiddleware } from "./server/middlewares/auth.middleware.js";

// Public Procedure: No auth required
export const publicProcedure = t.procedure;

export const authenticatedProcedure = t.procedure.use(authMiddleware);