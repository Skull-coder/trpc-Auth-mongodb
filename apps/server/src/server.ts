import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { createContext } from "@repo/trpc/context";
import { authRouter } from "@repo/trpc/server/routes/routes";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { connectToDatabase } from "@repo/database/db.js";
import { authLimiter } from "./utils/rateLimiter";
import { apiReference } from "@scalar/express-api-reference";
import {
  generateOpenApiDocument,
  createOpenApiExpressMiddleware,
} from "trpc-to-openapi";
import { envServer } from "@repo/env/server.js";

const app = express();
const port = envServer.PORT;
const MONGODB_URI = envServer.MONGODB_URI;
const FRONTEND_URL = envServer.FRONTEND_URL;

app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:4000"],
    credentials: true,
  }),
);

const { loginLimiter, registerLimiter } = authLimiter();

app.use("/trpc/auth.login", loginLimiter);
app.use("/trpc/auth.register", registerLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(
  "/trpc",
  createExpressMiddleware({
    router: authRouter,
    createContext,
  }),
);
const openApiDocument = generateOpenApiDocument(authRouter, {
  title: "Auth API",
  version: "1.0.0",
  baseUrl: `http://localhost:${port}/api`,
});
app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: authRouter,
    createContext,
  }),
);

app.use(
  "/docs",
  apiReference({
    content: openApiDocument,
    theme: "moon"
  }),
);

await connectToDatabase(MONGODB_URI);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
