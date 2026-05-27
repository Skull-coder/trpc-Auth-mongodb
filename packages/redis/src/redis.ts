import Redis from "ioredis";

function createRedisClient() { 
  return new Redis({
    host: "localhost",
    port: 6379,
  });
}

export const redis = createRedisClient();