import express from 'express';
import { loginHandler, logoutHandler, registerHandler, verifySessionHandler } from '../controllers/userController';

const router = express.Router();

router.post('/logout', logoutHandler);
router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.get('/verifySession', verifySessionHandler);

export default router;