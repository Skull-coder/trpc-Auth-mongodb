import type { JWTPayload as JoseJWTPayload } from "jose";

export interface AuthJWTPayload extends JoseJWTPayload {
    id: string;
}