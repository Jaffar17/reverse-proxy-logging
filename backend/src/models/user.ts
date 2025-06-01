import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    passwordHash: string;
}

const UserSchema = new Schema<IUser>({
    username:     { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});

export const User = mongoose.model<IUser>("User", UserSchema);