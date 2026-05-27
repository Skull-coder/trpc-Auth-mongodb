import rateLimit from "express-rate-limit";

export function authLimiter() {
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many login attempts",
    standardHeaders: true,
    legacyHeaders: false,
  });

  const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 3,
    message: "Too many accounts created",
  });

  return { loginLimiter, registerLimiter };
}
