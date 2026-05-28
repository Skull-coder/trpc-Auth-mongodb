import type { Request, Response, CookieOptions } from "express";
import {envServer} from "@repo/env/server.js";

const ACCESS_TOKEN = envServer.ACCESS_TOKEN;
const REFRESH_TOKEN = envServer.REFRESH_TOKEN;

export class CookieService {
  // Inject req and res via constructor
  constructor(
    private req: Request,
    private res: Response,
  ) {}

  private defaultCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };
  }

  private getCookie(name: string): string | undefined {
    return this.req.cookies?.[name];
  }

  private setCookie(
    name: string,
    value: string,
    maxAge: number,
    options: CookieOptions = {},
  ) {
    const defaultOptions: CookieOptions = this.defaultCookieOptions();
    this.res.cookie(name, value, { ...defaultOptions, maxAge, ...options });
  }

  private clearCookie(name: string, options: CookieOptions = {}) {
    const defaultOptions: CookieOptions = this.defaultCookieOptions();
    this.res.clearCookie(name, { ...defaultOptions, ...options });
  }

  public setAccessToken(token: string) {
    this.setCookie(ACCESS_TOKEN, token, 15 * 60 * 1000);
  }

  public setRefreshToken(token: string) {
    this.setCookie(REFRESH_TOKEN, token, 7 * 24 * 60 * 60 * 1000);
  }

  public getAccessToken(): string | undefined {
    return this.getCookie(ACCESS_TOKEN);
  }

  public getRefreshToken(): string | undefined {
    return this.getCookie(REFRESH_TOKEN);
  }

  public clearAuthCookies() {
    this.clearCookie(ACCESS_TOKEN);
    this.clearCookie(REFRESH_TOKEN);
  }
}
