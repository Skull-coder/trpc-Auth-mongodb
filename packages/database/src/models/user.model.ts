import mongoose from "mongoose";
import type { IUser } from "../interfaces/user.model.interface.ts";

export const UserSchema = new mongoose.Schema<IUser>({
    username: { 
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 50,
        lowercase: true,
        trim: true,
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        select: false,
    }
},{timestamps: true});

export default mongoose.model<IUser>("User", UserSchema);