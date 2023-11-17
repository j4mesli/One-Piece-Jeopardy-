import { Question } from "./Question";

export interface QuestionsToday {
    arcs: {
        questions: Question[],
        difficulty: number,
    },
    characters: {
        questions: Question[],
        difficulty: number,
    },
    abilities: {
        questions: Question[],
        difficulty: number,
    }
}