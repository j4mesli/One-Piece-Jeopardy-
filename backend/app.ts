import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import setup from "./setup";
import { loginHandler, logoutHandler, registerHandler, verifySessionHandler } from './controllers/userController';
import { fetchTestsHandler, evaluateTestHandler, deleteTestHandler, fetchQuestionHandler, evaluateQuestionHandler } from './controllers/gameController';

const app = express();

// set up express static directory
app.use(express.static(path.join(__dirname, 'public')));

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

// log all requests sent to backend
app.use(morgan('tiny'));

// establish CORS policy
app.use(cors());

// setup and connect to db
setup();

// route handling
app.get('/logout', logoutHandler);
app.get('/login', loginHandler);
app.get('/register', registerHandler);
app.get('/verifySession', verifySessionHandler);

app.get('/fetchTestQuestions', fetchTestsHandler);
app.get('/evaluateTest', evaluateTestHandler);
app.get('/deleteTest', deleteTestHandler);
app.get('/fetchQuestion', fetchQuestionHandler);
app.get('/evaluateQuestion', evaluateQuestionHandler);

app.listen(process.env.PORT || 3000, () => { console.log("backend listening on port 3000 at http://localhost:3000") });
