import { TRPCError } from "@trpc/server";
import { JWTService } from "@repo/auth/src/jwt/jwt.service.js";
import { t } from "../../trpc.js";
import {redis} from "@repo/redis/src/redis.js";

const jwt = new JWTService();

export const authMiddleware = t.middleware(async (options) => {

  const {ctx, next} = options

  const accessToken = ctx.cookieService.getAccessToken();

  if (!accessToken) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "Access token is missing"
    });
  }

  const blacklistedToken = await redis.get(`bl:${accessToken}`);

  if (blacklistedToken) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "Access token is blacklisted"
    });
  }

  const decoded = await jwt.verifyToken(accessToken);
  const userId = decoded.id as string;

  if (!userId) {
    throw new TRPCError({ 
      code: "UNAUTHORIZED", 
      message: "Invalid access token"
    });
  }

  return next({
    ctx: { ...ctx, userId: decoded.id as string },
  });
});