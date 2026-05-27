import { router } from "../../trpc.js";
import { publicProcedure, authenticatedProcedure } from "../../procedures.js";
import { authOutputScehma } from "../schemas/auth/base.schema.js";
import {
  registerInputSchema,
  registerOutputSchema,
} from "../schemas/auth/register/register.schema.js";

import {
  loginInputSchema,
  loginOutputSchema,
} from "../schemas/auth/login/login.schema.js";

import { AuthService } from "@repo/auth/src/auth.service.js";
import { getUserSchema } from "../schemas/auth/getUser/getUser.schema.js";
import { TRPCError } from "@trpc/server";

const authService = new AuthService();

export const authRouter = router({
  register: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/register",
        tags: ["Auth"],
        summary: "Register a new user",
        protect: false,
        description: "Endpoint to register a new user. Accepts username, email, and password. Returns the created user's id, username, and email.",
      },
    })
    .input(registerInputSchema)
    .output(registerOutputSchema)
    .mutation(async ({ input }) => {
      const result = await authService.register(input);

      return {
        success: result.success,
        message: result.message,
        data: {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
        },
      };
    }),

  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/login",
        tags: ["Auth"],
        summary: "Login user",
        protect: false,
        description: "Endpoint to login a user. Accepts email and password. Returns the authenticated user's id, username, and email. Also sets access and refresh tokens in HttpOnly cookies.",
      },
    })
    .input(loginInputSchema)
    .output(loginOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const result = await authService.login(input);

      const accessToken = result.data.accessToken;
      const refreshToken = result.data.refreshToken;

      ctx.cookieService.setAccessToken(accessToken);
      ctx.cookieService.setRefreshToken(refreshToken);

      return {
        success: result.success,
        message: result.message,
        data: {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
        },
      };
    }),

  logout: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/logout",
        tags: ["Auth"],
        summary: "Logout user",
        description: "Endpoint to logout a user. Clears the access and refresh tokens from HttpOnly cookies.",
        protect: true,
      },
    })
    .output(authOutputScehma)
    .mutation(async ({ ctx }) => {
      const accessToken = ctx.cookieService.getAccessToken();
      const refreshToken = ctx.cookieService.getRefreshToken();

      if (!accessToken || !refreshToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No tokens found"
        });
      }

      ctx.cookieService.clearAuthCookies();

      await authService.logout(accessToken, refreshToken);

      return {
        success: true,
        message: "Logged out successfully",
      };
    }),

  refresh: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/refresh",
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "Endpoint to refresh the access token using the refresh token. Returns the new access token and a new refresh token.",
        protect: true,
      },
    })
    .output(authOutputScehma)
    .mutation(async ({ ctx }) => {
      const refreshToken = ctx.cookieService.getRefreshToken();

      if (!refreshToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No refresh token found"
        });
      }

      const result = await authService.refresh(refreshToken);

      const accessToken = result.data.accessToken;
      const newRefreshToken = result.data.refreshToken;

      ctx.cookieService.setAccessToken(accessToken);
      ctx.cookieService.setRefreshToken(newRefreshToken);

      return {
        success: result.success,
        message: result.message,
      };
    }),

  getUser: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/me",
        tags: ["Auth"],
        summary: "Get current authenticated user",
        description: "Endpoint to get the current authenticated user's information.",
        protect: true,
      },
    })
    .output(getUserSchema)
    .query(async ({ ctx }) => {

      const userId = ctx.userId;
      
      const {success, message, data} = await authService.getUserById(userId);

      return {
        success,
        message,
        data
      };
    }),
});
