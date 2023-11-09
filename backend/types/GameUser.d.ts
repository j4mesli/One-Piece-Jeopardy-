import { Document, Schema } from "mongoose";

export interface GameUser extends Document {
    username: string;
    passwordHash: string;
    salt: string;
    sessionId: string | null;
    pastGames: Schema.Types.ObjectId[];
    setPassword: (password: string) => void;
    validatePassword: (password: string) => boolean;
}