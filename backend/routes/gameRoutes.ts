import express from 'express';
import { fetchTestsHandler, evaluateTestHandler, deleteTestHandler, fetchQuestionHandler, evaluateQuestionHandler } from '../controllers/gameController';

const router = express.Router();

router.get('/fetchTestQuestions', fetchTestsHandler);
router.post('/evaluateTest', evaluateTestHandler);
router.delete('/deleteTest', deleteTestHandler);
router.get('/fetchQuestion', fetchQuestionHandler);
router.post('/evaluateQuestion', evaluateQuestionHandler);

export default router;