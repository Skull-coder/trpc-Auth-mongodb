import mongoose from "mongoose";
import  redis  from "@repo/redis/src/redis.js";

export async function shutdown(server: import("http").Server, signal: string) {
  console.log(`${signal} received. Starting graceful shutdown...`);

  // Close MongoDB connection
  server.close(async () => {
    try {
      await mongoose.connection.close();
      await redis.quit();

      console.log("Graceful shutdown completed");
      process.exit(0);
    } catch (error) {
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
}
