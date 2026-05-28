import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { createContext } from "@repo/trpc/context";
import { authRouter } from "@repo/trpc/server/routes/routes";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { connectToDatabase } from "@repo/database/db.js";
import { createRateLimiter } from "./utils/rateLimiter";
import { apiReference } from "@scalar/express-api-reference";
import {
  generateOpenApiDocument,
  createOpenApiExpressMiddleware,
} from "trpc-to-openapi";
import { envServer } from "@repo/env/server.js";
import helmet from "helmet";

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  }),
);
const port = envServer.PORT;
const MONGODB_URI = envServer.MONGODB_URI;
const FRONTEND_URL = envServer.FRONTEND_URL;

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});
const registerLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});

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
  baseUrl: `/api`,
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
    theme: "moon",
    authentication:{
      preferredSecurityScheme: "cookieAuth",
    }
  }),
);

await connectToDatabase(MONGODB_URI);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
