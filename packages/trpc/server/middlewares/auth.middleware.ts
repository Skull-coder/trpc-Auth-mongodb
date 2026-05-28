import { TRPCError } from "@trpc/server";
import { JWTService } from "@repo/auth/src/jwt/jwt.service.js";
import { t } from "../../trpc.js";
import redis from "@repo/redis/src/redis.js";

const jwt = new JWTService();

export const authMiddleware = t.middleware(async (options) => {
  const { ctx, next } = options;

  const accessToken = ctx.cookieService.getAccessToken();

  if (!accessToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Access token is missing",
    });
  }

  const decodedToken = await jwt.verifyToken(accessToken);

  if (!decodedToken || typeof decodedToken === "string") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid access token",
    });
  }

  if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Access token has expired",
    });
  }

  const jti = decodedToken.jti;

  const blacklistedToken = await redis.get(`bl:${jti}`);

  if (blacklistedToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Access token is blacklisted",
    });
  }

  const userId = decodedToken.id as string;

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid access token",
    });
  }

  return next({
    ctx: { ...ctx, userId: decodedToken.id as string },
  });
});
