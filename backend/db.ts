import mongoose from 'mongoose';
import crypto from 'crypto';
import { GameUser } from './types/GameUser';

// User Schema
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

// Game Schema
const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timestamp: Date,
    score: Number,
    attempt: {
        category: String,
        questions: [
            {
                question: String,
                responses: Array,
                answer: String,
                points: Number
            }
        ]
    }
});

const User = mongoose.model<GameUser>('Users', userSchema);
const Game = mongoose.model('Game', gameSchema);

const connectDb = async () => {
    await mongoose.connect(process.env.DSN as string)
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));
}

export { User, Game, connectDb };
