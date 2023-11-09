import express from 'express';
import { fetchTestsHandler, fetchQuestionHandler } from '../controllers/gameController';

const router = express.Router();

router.get('/fetchTestQuestions', fetchTestsHandler);
router.get('/fetchQuestion', fetchQuestionHandler);

export default router;