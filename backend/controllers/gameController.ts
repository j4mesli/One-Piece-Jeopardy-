import { Request, Response } from "express";
import testQuestions from "../questions/testQuestions.json";
import crypto from "crypto";
import Game from "../models/GameInstance";
import User from "../models/GameUser";
import getMDY from "../functions/getMDY";

const fetchTestsHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionId) {
        const sessionId = headers.sessionId as string;
        const validated = await User.findOne({ sessionId: sessionId });
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
}

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

export { fetchTestsHandler, fetchQuestionHandler };