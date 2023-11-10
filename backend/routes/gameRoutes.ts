import express from 'express';
import { fetchTestsHandler, evaluateTestHandler, deleteTestHandler, fetchQuestionHandler, evaluateQuestionHandler } from '../controllers/gameController';

const router = express.Router();

router.get('/fetchTestQuestions', fetchTestsHandler);
router.get('/evaluateTest', evaluateTestHandler);
router.get('/deleteTest', deleteTestHandler);
router.get('/fetchQuestion', fetchQuestionHandler);
router.get('/evaluateQuestion', evaluateQuestionHandler);

export default router;