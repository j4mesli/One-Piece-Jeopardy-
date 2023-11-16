import mongoose from "mongoose";

// Game Schema
const gameSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    timestamp: Date,
    score: Number,
    attempt: {
        category: String,
        questions: [
            {
                question: String,
                response: String,
                answer: String,
                points: Number
            }
        ]
    }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;