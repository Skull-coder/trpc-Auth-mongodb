import mongoose from "mongoose";

const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB error:", err);
});

db.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

db.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function connectToDatabase(uri: string, maxRetries = 5) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      await mongoose.connect(uri, connectionOptions);

      console.log("Connected to MongoDB");
      return;
    } catch (error) {
      retryCount++;

      const delay = Math.min(1000 * 2 ** retryCount, 30000);

      console.error(
        `MongoDB connection failed. Retry ${retryCount}/${maxRetries} in ${delay}ms`,
      );

      await sleep(delay);
    }
  }

  console.error("Failed to connect to MongoDB after all retries");
  process.exit(1);
}
