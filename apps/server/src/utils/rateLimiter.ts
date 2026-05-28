import { RedisStore, type RedisReply } from "rate-limit-redis";
import redis from "@repo/redis/src/redis";
import { rateLimit } from "express-rate-limit";

export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
}) => {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (command: string, ...args: string[]) =>
        redis.call(command, ...args) as Promise<RedisReply>,
    }),
    windowMs: options.windowMs,
    max: options.max,
    standardHeaders: true,
    legacyHeaders: false,
  });
};
