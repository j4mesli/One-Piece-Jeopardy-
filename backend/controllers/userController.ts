import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/GameUser";
import getMDY from "../functions/getMDY";

const logoutHandler = async (req: Request, res: Response) => {
    const obj = req.query;
    if (obj.username) {
        try {
            const user = await User.findOne({ username: obj.username as string });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found."
                }); 
            } 
            else { 
                await user.updateOne({ sessionId: null });
                return res.status(201).send({ 
                    message : "Successfully Logged Out", 
                });
            }
        }
        catch(err) {
            console.error('Error logging out:', err);
            res.status(400).send({
                message: "Error logging out: " + err,
                error: err,
            });
        };
    }
    else {
        res.status(400).send({
            message: "Missing username"
        });
    }
};

const loginHandler = async (req: Request, res: Response) => {
    const obj = req.query;
    if (obj.username && obj.password) {
        try {
            const user = await User.findOne({ username: obj.username as string });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found."
                }); 
            } 
            else { 
                if (user.validatePassword(obj.password as string)) { 
                    const id = crypto.randomBytes(16).toString('base64');
                    await user.updateOne({ sessionId: id });
                    return res.status(201).send({ 
                        message : "User Logged In", 
                        session: {
                            id: id,
                            username: user.username,
                            timestamp: getMDY(),
                        }
                    });
                } 
                else { 
                    return res.status(400).send({ 
                        message : "Wrong Password"
                    }); 
                } 
            }
        }
        catch(err) {
            console.error('Error logging in:', err);
            res.status(400).send({
                message: "Error logging in: " + err,
                error: err,
            });
        };
    }
    else {
        res.status(400).send("Missing username or password");
    }
};

const registerHandler = async (req: Request, res: Response) => {
    const obj = req.query;
    if (obj.username && obj.password) {
        obj.username = (obj.username as string).toLowerCase();
        obj.password = obj.password as string;

        const newUser = new User({
            username: obj.username
        });
        newUser.setPassword(obj.password);

        try {
            const savedUser = await newUser.save();
            res.status(200).send({
                user: savedUser,
                message: "User created",
            });
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(400).send({
                message: "Error creating user: " + err,
                error: err,
            });
        }
    }
    else {
        res.status(400).send({
            message: "Missing username or password"
        });
    }
};

const verifySessionHandler = async (req: Request, res: Response) => {
    const obj = req.query;
    if (obj.id && obj.username) {
        obj.username = (obj.username as string).toLowerCase();
        obj.id = obj.id as string;
        try {
            const user = await User.findOne({ username: obj.username as string });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found."
                }); 
            } 
            else { 
                if (user.sessionId === obj.id) { 
                    return res.status(201).send({ 
                        message : "Session Valid", 
                        session: {
                            id: obj.id,
                            username: user.username,
                            timestamp: getMDY(),
                        }
                    });
                } 
                else { 
                    return res.status(400).send({ 
                        message : "Session Invalid"
                    }); 
                } 
            }
        }
        catch(err) {
            console.error('Error verifying session:', err);
            res.status(400).send({
                message: "Error verifying session: " + err,
                error: err,
            });
        };
    }
    else {
        res.status(400).send({
            message: "Missing id or username"
        });
    }
};

export { loginHandler, logoutHandler, registerHandler, verifySessionHandler };