import User from "@repo/database/src/models/user.model.js"
import type {RegisterInput, RegisterOutput} from "@repo/trpc/server/schemas/auth/register/register.schema.js"
import type {LoginInput, LoginOutput} from "@repo/trpc/server/schemas/auth/login/login.schema.js"
import argon2 from "argon2"
import crypto from "crypto"
import { JWTService } from "./jwt/jwt.service.js";
import type { AuthServiceOutput, LoginAuthOutput, RegisterAuthOutput, RefreshAuthOutput, GetUserAuthOutput } from "./interfaces/auth.interface.js"
import {redis} from "@repo/redis/src/redis.js"
import {TRPCError} from "@trpc/server";

const jwt = new JWTService();

export class AuthService {

    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    }

    private async generateAccessAndRefreshTokens(userId: string): Promise<{ accessToken: string, refreshToken: string }> {
        const accessToken = await jwt.generateToken({ id: userId });
        const refreshToken = crypto.randomBytes(64).toString("hex");

        return {
            accessToken,
            refreshToken
        }
    }

    public async register(payload: RegisterInput): Promise<RegisterAuthOutput> {
        // destructure payload
        const {username, email, password} = payload;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "User with this email already exists"
            });
        }

        //hash password
        const hashedPassword = await this.hashPassword(password);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // Return user data without password
        return {

            success: true,
            message: "User registered successfully",
            data: {
                id: newUser._id.toString(),
                username: newUser.username,
                email: newUser.email,
            }
        };
    }

    public async login(payload: LoginInput): Promise<LoginAuthOutput> {
        const { email, password } = payload;

        // Find user by email
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid email or password"
            });
        }

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await this.generateAccessAndRefreshTokens(user._id.toString());

        // Store refresh token in Redis
        await redis.set(`refresh_token:${refreshToken}`, user._id.toString(), "EX", 60 * 60 * 24 * 7); // Expire in 7 days

        // Return user data without password
        return {
            success: true,
            message: "Login successful",
            data: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                accessToken,
                refreshToken
            }
        };
    }

    public async logout(accessToken:string, refreshToken: string): Promise<AuthServiceOutput<null>> { 
        // Blacklist access token
        await redis.set(`bl:${accessToken}`, "1", "EX", 60 * 15);
        
        // Remove refresh token from Redis
        await redis.del(`refresh_token:${refreshToken}`);

        return {
            success: true,
            message: "Logged out successfully",
            data: null
        }
    }

    public async refresh(refreshToken: string): Promise<RefreshAuthOutput> {
        // Get user id from Redis using refresh token
        const userId = await redis.get(`refresh_token:${refreshToken}`);
        if (!userId) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Invalid refresh token"
            });
        }

        // Generate new access and refresh tokens
        const {accessToken, refreshToken: newRefreshToken} = await this.generateAccessAndRefreshTokens(userId);

        // Store new refresh token in Redis and delete old one
        await redis.multi()
            .set(`refresh_token:${newRefreshToken}`, userId, "EX", 60 * 60 * 24 * 7) // Expire in 7 days
            .del(`refresh_token:${refreshToken}`)
            .exec();

        return {
            success: true,
            message: "Tokens refreshed successfully",
            data: {
                accessToken,
                refreshToken: newRefreshToken,
            }
        };
    }



    public async getUserById(userId: string): Promise<GetUserAuthOutput> {
        try {

            const user = await User.findById(userId).select("-password");
            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "User not found"
                });
            }
            return {
                success: true,
                message: "User found",
                data: {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                }
            };
        } catch (error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Invalid or expired token"
            });
        }
    }
}