import EndGameResult from "./EndGameResult";

export interface EndGame {
    message: string;
    score: number;
    results: Array<EndGameResult>;
    status: number;
}