import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/GameUser";
import getMDY from "../functions/getMDY";

const logoutHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.username && headers.sessionid) {
        try {
            const user = await User.findOne({ username: headers.username as string });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found.",
                    status: 400
                }); 
            } 
            else { 
                console.log(user)
                if (user.sessionId !== headers.sessionid) { 
                    return res.status(400).send({ 
                        message : "Session Invalid",
                        status: 400
                    }); 
                }
                await user.updateOne({ sessionId: null });
                return res.status(201).send({ 
                    message : "Successfully Logged Out", 
                    status: 201,
                });
            }
        }
        catch(err) {
            console.error('Error logging out:', err);
            res.status(400).send({
                message: "Error logging out: " + err,
                error: err,
                status: 400,
            });
        };
    }
    else {
        res.status(400).send({
            message: "Missing username",
            status: 400
        });
    }
};

const loginHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.username && headers.password) {
        try {
            const user = await User.findOne({ username: headers.username as string });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found.",
                    status: 400
                }); 
            } 
            else { 
                if (user.validatePassword(headers.password as string)) { 
                    const id = crypto.randomBytes(16).toString('base64');
                    await user.updateOne({ sessionId: id });
                    return res.status(201).send({ 
                        message : "User Logged In", 
                        status: 201,
                        session: {
                            sessionId: id,
                            username: user.username,
                            timestamp: getMDY(),
                        }
                    });
                } 
                else { 
                    return res.status(400).send({ 
                        message : "Wrong Password",
                        status: 400
                    }); 
                } 
            }
        }
        catch(err) {
            console.error('Error logging in:', err);
            res.status(400).send({
                message: "Error logging in: " + err,
                error: err,
                status: 400,
            });
        };
    }
    else {
        res.status(400).send({
            message: "Missing username or password",
            status: 400,
        });
    }
};

const registerHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.username && headers.password) {
        headers.username = (headers.username as string).toLowerCase();
        headers.password = headers.password as string;

        const newUser = new User({
            username: headers.username,
            sessionId: crypto.randomBytes(16).toString('base64'),
        });
        newUser.setPassword(headers.password);

        try {
            const savedUser = await newUser.save();
            res.status(200).send({
                user: {
                    username: savedUser.username,
                    sessionId: savedUser.sessionId,
                    timestamp: getMDY(),
                },
                message: "User created",
                status: 200,
            });
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(400).send({
                message: "Error creating user: " + err,
                error: err,
                status: 400,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Missing username or password",
            status: 400
        });
    }
};

const verifySessionHandler = async (req: Request, res: Response) => {
    const headers = req.headers;
    console.log(headers, headers.sessionid, headers.username)
    if (headers.sessionid && headers.username) {
        headers.username = (headers.username as string).toLowerCase();
        headers.sessionid = headers.sessionid as string;
        try {
            const user = await User.findOne({ username: headers.username as string });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found.",
                    status: 400
                }); 
            } 
            else { 
                if (user.sessionId === headers.sessionid) { 
                    return res.status(201).send({ 
                        message : "Session Valid", 
                        session: {
                            sessionId: headers.id,
                            username: user.username,
                            timestamp: getMDY(),
                        },
                        status: 201,
                    });
                } 
                else { 
                    return res.status(401).send({ 
                        message : "Session Invalid",
                        status: 401
                    }); 
                } 
            }
        }
        catch(err) {
            console.error('Error verifying session:', err);
            res.status(400).send({
                message: "Error verifying session: " + err,
                error: err,
                status: 400,
            });
        };
    }
    else {
        res.status(400).send({
            message: "Missing id or username",
            status: 400
        });
    }
};

export { loginHandler, logoutHandler, registerHandler, verifySessionHandler };