import {SignJWT, jwtVerify} from "jose"
import {StrictJWTPayload, TokenGenerationInput} from "../interfaces/jwtPayload.interface.js"
import { TRPCError } from "@trpc/server";
import { envServer } from "@repo/env/server.js";

export class JWTService {
    private secretKey: Uint8Array = new TextEncoder().encode(envServer.JWT_SECRET);

    public async generateToken(payload: TokenGenerationInput, expiresIn: string = "15m"): Promise<string> {
        const token = await new SignJWT(payload)
            .setJti(crypto.randomUUID())
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setExpirationTime(expiresIn)
            .sign(this.secretKey);
        return token;
    }

    public async verifyToken(token: string): Promise<StrictJWTPayload> {
        try {
            const { payload } = await jwtVerify(token, this.secretKey, {
                requiredClaims: ["jti", "exp", "id"],
            });
            return payload as StrictJWTPayload;
        } catch (error) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid or expired token"
            });
        }
    }
}