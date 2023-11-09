import mongoose from "mongoose";
import crypto from "crypto";
import { GameUser } from "../types/GameUser";

const userSchema = new mongoose.Schema<GameUser>({
    username: String,
    passwordHash: String,
    salt: String,
    sessionId: String || null,
    pastGames: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }],
});

userSchema.methods.setPassword = function(password: string) { 
    this.salt = crypto.randomBytes(16).toString('hex'); 
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
}; 

userSchema.methods.validatePassword = function(password: string): boolean { 
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`); 
    console.log(this, this.passwordHash, hash);
    return this.passwordHash === hash; 
}; 

const User = mongoose.model<GameUser>('Users', userSchema);

export default User;