import {User, Game} from "./db";
import express from "express";
import dotenv from "dotenv";
import path from 'path';
import url from 'url';

const app = express();

// set up express static
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.redirect("/login");
})

app.get("/login", (req, res) => {

});

app.listen(process.env.PORT || 3000);