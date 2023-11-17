import express from 'express';
import { fetchTestsHandler, evaluateTestHandler, deleteTestHandler, fetchQuestionHandler, evaluateQuestionsHandler, fetchDifficultiesHandler } from '../controllers/gameController';

const router = express.Router();

router.get('/fetchTestQuestions', fetchTestsHandler);
router.post('/evaluateTest', evaluateTestHandler);
router.delete('/deleteTest', deleteTestHandler);
router.get('/getDifficulties', fetchDifficultiesHandler);
router.get('/fetchQuestion', fetchQuestionHandler);
router.post('/evaluateQuestions', evaluateQuestionsHandler);

export default router;