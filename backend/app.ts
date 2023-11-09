import {User, Game, connectDb} from "./db";
import express from "express";
import dotenv from "dotenv";
import path from 'path';
import url from 'url';
import setup from "./setup";
import { GameUser } from "./types/GameUser";
import crypto from "crypto";
import getMDY from "./methods/getMDY";

const app = express();

// set up express static directory
app.use(express.static(path.join(__dirname, 'public')));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// setup and connect to db
setup();

app.post("/login", async (req, res) => {
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
                    user.updateOne({ sessionId: id });
                    return res.status(201).send({ 
                        message : "User Logged In", 
                        session: {
                            id: id,
                            user: user,
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
            res.status(400).send("Error logging in: " + err);
        };
    }
    else {
        res.status(400).send("Missing username or password");
    }
});

app.post("/logout", async (req, res) => {
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
                user.updateOne({ sessionId: null });
                return res.status(201).send({ 
                    message : "Successfully Logged Out", 
                });
            }
        }
        catch(err) {
            console.error('Error logging out:', err);
            res.status(400).send("Error logging out: " + err);
        };
    }
});

app.post("/register", async (req, res) => {
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
            res.status(400).send("Error creating user: " + err);
        }
    }
    else {
        res.status(400).send("Invalid username or password");
    }
});

app.listen(process.env.PORT || 3000, () => { console.log("backend listening on port 3000 at http://localhost:3000") });
