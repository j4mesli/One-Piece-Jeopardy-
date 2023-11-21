import { Request, Response } from "express";
import crypto from "crypto";
import User from "../models/GameUser";
import getMDY from "../functions/getMDY";
import avatars from "../json/avatars.json";
import Game from "../models/GameInstance";

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
        headers.username = (headers.username as string).toLowerCase();
        try {
            const user = await User.findOne({ username: headers.username });
            if (user === null) { 
                return res.status(400).send({ 
                    message : "User not found.",
                    status: 400
                }); 
            } 
            else { 
                if (user.validatePassword(headers.password as string)) { 
                    const id = crypto.randomBytes(16).toString('base64');
                    if (!user.avatar) {
                        user.avatar = avatars[Math.floor(Math.random() * avatars.length)];
                    }
                    user.sessionId = id;
                    await user.save();
                    return res.status(201).send({ 
                        message : "User Logged In", 
                        status: 201,
                        session: {
                            sessionId: id,
                            username: user.username,
                            avatar: user.avatar,
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

        const user = await User.findOne({ username: headers.username });
        if (user) {
            return res.status(400).send({
                message: "User already exists",
                status: 400,
            });
        }

        const newUser = new User({
            username: headers.username,
            sessionId: crypto.randomBytes(16).toString('base64'),
            points: 0,
            avatar: avatars[Math.floor(Math.random() * avatars.length)],
        });
        newUser.setPassword(headers.password);

        try {
            const savedUser = await newUser.save();
            res.status(200).send({
                user: {
                    username: savedUser.username,
                    sessionId: savedUser.sessionId,
                    avatar: savedUser.avatar,
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

const evaluatePlayedToday = async (req: Request, res: Response) => {
    const headers = req.headers;
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
                    if (!user.lastPlayed) {
                        return res.status(201).send({ 
                            message : "Can Play", 
                            playedToday: false,
                            status: 201,
                        });
                    }
                    else if ((user.lastPlayed as unknown as Date).toISOString() !== getMDY().toISOString()) {
                        return res.status(201).send({ 
                            message : "Can Play",
                            playedToday: false,
                            status: 201,
                        });
                    }
                    else {
                        return res.status(401).send({ 
                            message : "Can't play",
                            playedToday: true,
                            status: 401
                        });
                    }
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

const fetchUser = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid && headers.username) {
        const username = (headers.username as string).toLowerCase();
        const sessionid = headers.sessionid as string;
        const user = await User.findOne({ sessionId: sessionid });
        if (user) {
            if (user.username !== username) {
                return res.status(400).send({
                    message: "Username does not match!",
                    status: 400
                });
            }
            res.status(200).send({
                user: {
                    username: user.username,
                    avatar: user.avatar,
                    lastPlayed: user.lastPlayed,
                    points: user.points,
                },
                message: "User found",
                status: 200,
            });
        }
        else {
            res.status(400).send({
                message: "Session Invalid",
                status: 400
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request",
            status: 400
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid) {
        const validated = await User.findOne({ sessionId: headers.sessionid as string });
        if (validated) {
            if (headers.newusername || headers.newavatar) {
                const newUsername = (headers.newusername as string);
                const newAvatar = headers.newavatar as string;
                if (newUsername) {
                    const existingUser = await User.findOne({ username: newUsername.toLowerCase() });
                    if (existingUser) {
                        return res.status(400).send({
                            message: "Username already exists!",
                            status: 400
                        });
                    }
                    await validated.updateOne({ username: newUsername.toLowerCase() });
                }
                if (newAvatar) {
                    await validated.updateOne({ avatar: newAvatar });
                }
                res.status(200).send({
                    user: {
                        // nullish coalesce new if exists, otherwise old
                        username: newUsername ?? validated.username,
                        avatar: newAvatar ?? validated.avatar,
                        lastPlayed: validated.lastPlayed,
                        points: validated.points,
                    },
                    message: "User updated",
                    status: 200,
                });
            }
            else {
                res.status(400).send({
                    message: "Please provide a username or avatar",
                    status: 400
                });
            }
        }
        else {
            res.status(400).send({
                message: "Session Invalid",
                status: 400
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request",
            status: 400
        });
    }
};

const fetchUserRank = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid && headers.username) {
        const username = (headers.username as string).toLowerCase();
        const sessionid = headers.sessionid as string;
        const user = await User.findOne({ sessionId: sessionid });
        if (user) {
            if (username === user.username) {
                // Aggregation pipeline, MongoDB equivalent of the query:
                // SELECT username, points, RANK() OVER (ORDER BY points DESC) AS rank
                // FROM users
                // WHERE username = 'specificUsername';
                const userRank = await User.aggregate([
                    { $sort: { points: -1 } },
                    {
                        $setWindowFields: {
                            sortBy: { points: -1 },
                            output: { rank: { $rank: {} } }
                        }
                    },
                    { $match: { username: username } },
                    { $limit: 1 }
                ]);
                if (userRank.length === 0) {
                    return res.status(400).send({
                        message: "User ranking not found!",
                        status: 400
                    });
                }
                const rank = userRank[0].rank;
                res.status(200).send({
                    username,
                    rank: rank,
                    points: user.points,
                    message: "User rank found",
                    status: 200,
                });
            }
        }
        else {
            res.status(400).send({
                message: "Session Invalid",
                status: 400
            });
        
        }
    }
    else {
        res.status(400).send({
            message: "Bad request",
            status: 400
        });
    }
}

const fetchMostRecentGame = async (req: Request, res: Response) => {
    const headers = req.headers;
    if (headers.sessionid && headers.username) {
        const username = (headers.username as string).toLowerCase();
        const sessionid = headers.sessionid as string;
        const user = await User.findOne({ sessionId: sessionid });
        if (user) {
            const game = await Game.findOne({ user: user._id }).sort({ timestamp: -1 });
            if (game) {
                res.status(200).send({
                    score: game.score,
                    category: game.attempt ? game.attempt.category : 'characters',
                    results: game.attempt!.questions,
                    message: "Most recent game found",
                    status: 200,
                });
            }
            else {
                res.status(400).send({
                    message: "No games found!",
                    status: 400
                });
            }
        }
        else {
            res.status(400).send({
                message: "Session Invalid",
                status: 400
            });
        }
    }
    else {
        res.status(400).send({
            message: "Bad request",
            status: 400
        });
    }
}

export { loginHandler, logoutHandler, registerHandler, verifySessionHandler, evaluatePlayedToday, fetchUser, updateUser, fetchUserRank, fetchMostRecentGame };