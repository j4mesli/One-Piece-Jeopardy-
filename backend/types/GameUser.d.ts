import { Document, Schema } from "mongoose";

export interface GameUser extends Document {
    username: string;
    passwordHash: string;
    salt: string;
    sessionId: string | null;
    lastPlayed: string | null;
    points: number;
    avatar: string;
    pastGames: Schema.ObjectId[];
    setPassword: (password: string) => void;
    validatePassword: (password: string) => boolean;
}