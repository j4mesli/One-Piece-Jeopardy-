import express from "express";
import path from 'path';
import setup from "./setup";
import userRoutes from "./routes/userRoutes";

const app = express();

// set up express static directory
app.use(express.static(path.join(__dirname, 'public')));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// setup and connect to db
setup();

// user routes (MVC)
app.use("/", userRoutes);

app.listen(process.env.PORT || 3000, () => { console.log("backend listening on port 3000 at http://localhost:3000") });
