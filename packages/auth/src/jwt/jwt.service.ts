import {SignJWT, jwtVerify} from "jose"
import {AuthJWTPayload} from "./jwt.types.js"
import { TRPCError } from "@trpc/server";

export class JWTService {
    private secretKey: Uint8Array = new TextEncoder().encode(process.env.JWT_SECRET || "bguya12fdwuy13@#wqaudvyqHGHgghc@123424vfy");

    public async generateToken(payload: AuthJWTPayload, expiresIn: string = "1h"): Promise<string> {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setExpirationTime(expiresIn)
            .sign(this.secretKey);
        return token;
    }

    public async verifyToken(token: string): Promise<AuthJWTPayload> {
        try {
            const { payload } = await jwtVerify(token, this.secretKey);
            return payload as AuthJWTPayload;
        } catch (error) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid or expired token"
            });
        }
    }
}