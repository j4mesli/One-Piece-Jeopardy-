import { Request, Response } from "express";
import testQuestions from "../questions/testQuestions.json";
import User from "../models/GameUser";
import { GameUser } from "../types/GameUser";
import Game from "../models/GameInstance";
import getMDY from "../functions/getMDY";

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

const fetchQuestionHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.index && headers.sessionId) {
        const index = +headers.index;
        const sessionId = headers.sessionId as string;
        const validated = await User.findOne({ sessionId: sessionId });
        if (validated) {
            const question = testQuestions[index];
            if (question) {
                res.status(200).send({
                    message: "OK, Question successfully fetched",
                    question,
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

const evaluateQuestionHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.index && headers.sessionId && headers.answer) {
        const index = +headers.index;
        const sessionId = headers.sessionId as string;
        const answer = headers.answer as string;
        const validated = await User.findOne({ sessionId: sessionId });
        if (validated) {
            const question = testQuestions[index];
            if (question) {
                if (question.answer === answer) {
                    res.status(200).send({
                        message: "Correct answer",
                        status: 200,
                    });
                }
                else {
                    res.status(202).send({
                        message: "wrong answer",
                        status: 202,
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

export { fetchTestsHandler, evaluateTestHandler, deleteTestHandler, fetchQuestionHandler, evaluateQuestionHandler };