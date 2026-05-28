import { JWTPayload } from "jose";

export interface StrictJWTPayload extends JWTPayload {
  id: string;
  jti: string;
  exp: number;
}

export interface TokenGenerationInput extends JWTPayload {
  id: string;
}