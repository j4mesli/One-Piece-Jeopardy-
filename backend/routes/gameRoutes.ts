import express from 'express';
import { 
    fetchTestsHandler, 
    evaluateTestHandler, 
    deleteTestHandler, 
    fetchQuestionHandler, 
    evaluateQuestionsHandler, 
    fetchDifficultiesHandler, 
    fetchLeaderboard 
} from '../controllers/gameController';

const router = express.Router();

router.get('/fetchTestQuestions', fetchTestsHandler);
router.post('/evaluateTest', evaluateTestHandler);
router.delete('/deleteTest', deleteTestHandler);
router.get('/getDifficulties', fetchDifficultiesHandler);
router.get('/fetchQuestion', fetchQuestionHandler);
router.post('/evaluateQuestions', evaluateQuestionsHandler);
router.get('/fetchLeaderboard', fetchLeaderboard);

export default router;