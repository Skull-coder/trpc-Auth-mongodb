import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { CookieService } from "@repo/auth/src/cookie/cookie.service.js";

export interface Context {
  cookieService: Omit<CookieService, "req" | "res">;
}

export async function createContext({ req, res }: CreateExpressContextOptions): Promise<Context> {

  const cookieService = new CookieService(req, res);

  const ctx: Context = {
    cookieService,
  }
  return ctx;
}