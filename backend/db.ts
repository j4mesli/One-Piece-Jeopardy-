import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    pastGames: Array,
});

const gameSchema = new mongoose.Schema({
    user: String,
    timestamp: Date,
    score: Number,
    attempt: {
        questions: 
    }
});

const User = mongoose.model('Review', userSchema);
const Game = mongoose.model('Game', gameSchema);

export { User, Game };
