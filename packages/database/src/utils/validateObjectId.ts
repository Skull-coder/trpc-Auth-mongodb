import mongoose from "mongoose";

export function validateObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}