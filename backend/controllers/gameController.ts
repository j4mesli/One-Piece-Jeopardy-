import { Request, Response } from "express";
import testQuestions from "../json/testQuestions.json";
import today from "../json/today.json";
import User from "../models/GameUser";
import { GameUser } from "../types/GameUser";
import Game from "../models/GameInstance";
import getMDY from "../functions/getMDY";
import { QuestionsToday } from "../types/QuestionsToday";
import * as fuzzy from "fast-fuzzy";

const _today = today as QuestionsToday;

const fetchTestsHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid) {
        const sessionid = headers.sessionid as string;
        const validated = await User.findOne({ sessionId: sessionid });
        if (validated) {
            res.status(200).send({
                questions: testQuestions,
                status: 200
            });
        }
        else {
            res.status(400).send({
                message: "Bad request, invalid sessionId",
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request, please provide proper information",
            status: 400,
        });
    }
};

const evaluateTestHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid && headers.answers) {
        const sessionid = headers.sessionid as string;
        const answers = JSON.parse(headers.answers as string);
        const validated = await User.findOne({ sessionId: sessionid });
        if (validated) {
            const User: GameUser = validated;
            let score = 0;
            for (let i = 0; i < answers.length; i++) {
                if (answers[i] === testQuestions[i].answer) {
                    score++;
                }
            }
            const game = new Game({
                user: User._id,
                timestamp: getMDY(),
                score,
                attempt: {
                    category: "test",
                    questions: testQuestions
                }
            });
            User.pastGames.push(game._id);
            await game.save();
            await User.save();
            res.status(200).send({
                message: "OK, Test successfully evaluated",
                score,
                status: 200,
            });
        }
        else {
            res.status(400).send({
                message: "Bad request, invalid sessionId",
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request, please provide proper information",
            status: 400,
        });
    }
};

const deleteTestHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid && headers.username) {
        const sessionid = headers.sessionid as string;
        const username = headers.username as string;
        const validated = await User.findOne({ sessionId: sessionid });
        if (validated) {
            const User: GameUser = validated;
            const game = await Game.findOne({ user: User._id });
            if (game) {
                // need to convert them to strings to compare them
                if (game.user!.toString() === User._id.toString()) {
                    await game.deleteOne();
                    res.status(200).send({
                        message: "OK, Test successfully deleted",
                        status: 200,
                    });
                }
                else {
                    res.status(400).send({
                        message: "Bad request, game does not belong to user",
                        status: 400,
                    });
                }
            }
            else {
                res.status(400).send({
                    message: "Bad request, invalid gameid",
                    status: 400,
                });
            }
        }
        else {
            res.status(400).send({
                message: "Bad request, invalid sessionId",
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request, please provide proper information",
            status: 400,
        });
    }
};

const fetchDifficultiesHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid) {
        const sessionId = headers.sessionid as string;
        const validated = await User.findOne({ sessionId: sessionId });
        if (validated) {
            res.status(200).send({
                message: "OK, Difficulties successfully fetched",
                difficulties: {
                    characters: _today.characters.difficulty,
                    abilities: _today.abilities.difficulty,
                    arcs: _today.arcs.difficulty,
                },
                status: 200,
            });
        }
        else {
            res.status(400).send({
                message: "Bad request, invalid sessionId",
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request, please provide proper information",
            status: 400,
        });
    }
};

const fetchQuestionHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.category && headers.index && headers.sessionid) {
        const index = +headers.index;
        const sessionId = headers.sessionid as string;
        const category = headers.category as string;
        const validated = await User.findOne({ sessionId: sessionId });
        if (validated) {
            if (category === "characters" || category === "abilities" || category === "arcs") {
                const question = _today[category].questions[index];
                if (question) {
                    res.status(200).send({
                        message: "OK, Question successfully fetched",
                        question: question.question,
                        status: 200,
                    });
                }
                else {
                    res.status(400).send({
                        message: "Bad request, index out of bounds",
                        status: 400,
                    });
                }
            }
            else {
                res.status(400).send({
                    message: "Bad request, invalid category",
                    status: 400,
                });
            }
        }
        else {
            res.status(400).send({
                message: "Bad request, invalid sessionId",
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request, please provide proper information",
            status: 400,
        });
    }
};

const evaluateQuestionsHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.category && headers.sessionid && headers.responses) {
        const sessionId = headers.sessionid as string;
        const category = headers.category as string;
        const responsesRaw = headers.responses as string;
        const responses = JSON.parse(responsesRaw);
        const validated = await User.findOne({ sessionId: sessionId });
        if (validated) {
            let score = 0;
            const finalMarks = [] as Array<{
                question: String,
                response: String,
                answer: String,
                points: Number
            }>;
            responses.forEach((response: {index: number, answer: string}) => {
                const index = response.index;
                const answer = response.answer;
                if (category === "characters" || category === "abilities" || category === "arcs") {
                    const question = _today[category].questions[index];
                    if (question) {
                        // fuzzy match for "close enough" answers
                        const similarity = fuzzy.fuzzy(answer, question.answer);
                        console.log(similarity);
                        if (similarity > 0.9) {
                            finalMarks.push({
                                question: question.question, 
                                response: answer, 
                                answer: question.answer, 
                                points: category === "characters" ? 2 : (category === "abilities" ? 3 : 1)
                            });
                            score += category === "characters" ? 2 : (category === "abilities" ? 3 : 1);
                        }
                        else {
                            finalMarks.push({
                                question: question.question, 
                                response: answer, 
                                answer: question.answer, 
                                points: 0
                            });
                        }
                    }
                    else {
                        res.status(400).send({
                            message: "Bad request, index out of bounds",
                            status: 400,
                        });
                    }
                }
                else {
                    res.status(400).send({
                        message: "Bad request, invalid category",
                        status: 400,
                    });
                }
            });
            const game = new Game({
                user: validated._id,
                timestamp: getMDY(),
                score,
                attempt: {
                    category,
                    questions: finalMarks,
                }
            });
            validated.pastGames.push(game._id);
            validated.lastPlayed = getMDY().toISOString();
            if (!validated.points) {
                validated.points = score;
            }
            else {
                validated.points += score;
            }
            await game.save();
            await validated.save();
            res.status(200).send({
                message: "OK, questions successfully evaluated",
                score,
                results: finalMarks,
                status: 200,
            });
        }
        else {
            res.status(400).send({
                message: "Bad request, invalid sessionId",
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request, please provide proper information",
            status: 400,
        });
    }
};

export { fetchTestsHandler, evaluateTestHandler, deleteTestHandler, fetchDifficultiesHandler, fetchQuestionHandler, evaluateQuestionsHandler };