import express from 'express';
import { 
    loginHandler, 
    logoutHandler, 
    registerHandler, 
    verifySessionHandler, 
    evaluatePlayedToday, 
    fetchUser, 
    updateUser, 
    fetchUserRank 
} from '../controllers/userController';

const router = express.Router();

router.post('/logout', logoutHandler);
router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.get('/verifySession', verifySessionHandler);
router.get('/evaluatePlayedToday', evaluatePlayedToday);
router.get('/fetchUser', fetchUser);
router.get('/fetchUserRank', fetchUserRank);
router.post('/updateUser', updateUser);

export default router;