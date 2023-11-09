import mongoose from "mongoose";

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

const Game = mongoose.model('Game', gameSchema);

export default Game;