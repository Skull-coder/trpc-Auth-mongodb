import { Redis } from "ioredis";
import type { RedisOptions } from "ioredis";
import { envServer } from "@repo/env/server.js";

const redisOptions: RedisOptions = {
  // 1. Dynamic Configuration via Environment Variables
  host: envServer.REDIS_HOST,
  port: parseInt(envServer.REDIS_PORT, 10),
  password: envServer.REDIS_PASSWORD,

  // 2. Reconnection Strategy (Exponential Backoff)
  retryStrategy(times) {
    const maxRetries = 20; 
    if (times >= maxRetries) {
      console.error(`[Redis] Connection failed after ${maxRetries} retries.`);
      return null; 
    }
    
    // Delay increases with each retry: 50ms, 100ms, 150ms... up to 2 seconds
    const delay = Math.min(times * 50, 2000);
    return delay;
  },

  // 3. Timeouts and Limits
  connectTimeout: 10000, 
  maxRetriesPerRequest: 3,
};

// Initialize the client
const redis = new Redis(redisOptions);

// 4. Comprehensive Error Handling & Observability
redis.on("connect", () => console.log("[Redis] Connecting..."));
redis.on("ready", () => console.log("[Redis] Connected and ready to receive commands."));
redis.on("error", (err) => console.error("[Redis] Error:", err.message));
redis.on("close", () => console.warn("[Redis] Connection closed."));
redis.on("reconnecting", () => console.log("[Redis] Reconnecting..."));
redis.on("end", () => console.log("[Redis] Connection ended permanently."));

export default redis;