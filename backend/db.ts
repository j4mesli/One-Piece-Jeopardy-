import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    pastGames: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }],
});

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

const User = mongoose.model('Review', userSchema);
const Game = mongoose.model('Game', gameSchema);

export { User, Game };
