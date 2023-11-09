import express from "express";
import morgan from "morgan";
import path from 'path';
import setup from "./setup";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";

const app = express();

// set up express static directory
app.use(express.static(path.join(__dirname, 'public')));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// log all requests sent to backend
app.use(morgan('tiny'));

// setup and connect to db
setup();

// route handling
app.use("/", userRoutes);
app.use("/", gameRoutes);

app.listen(process.env.PORT || 3000, () => { console.log("backend listening on port 3000 at http://localhost:3000") });
