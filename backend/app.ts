import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import setup from "./setup";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";
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
app.post('/logout', logoutHandler);
app.post('/login', loginHandler);
app.post('/register', registerHandler);
app.get('/verifySession', verifySessionHandler);

app.get('/fetchTestQuestions', fetchTestsHandler);
app.post('/evaluateTest', evaluateTestHandler);
app.delete('/deleteTest', deleteTestHandler);
app.get('/fetchQuestion', fetchQuestionHandler);
app.post('/evaluateQuestion', evaluateQuestionHandler);

app.listen(process.env.PORT || 3000, () => { console.log("backend listening on port 3000 at http://localhost:3000") });
