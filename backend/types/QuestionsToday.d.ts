import { Question } from "./Question";

export interface QuestionsToday {
    "arcs": {
        "questions": Question[],
    },
    "characters": {
        "questions": Question[],
    },
    "abilities": {
        "questions": Question[],
    }
}