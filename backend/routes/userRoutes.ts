import express from 'express';
import { loginHandler, logoutHandler, registerHandler, verifySessionHandler } from '../controllers/userController';

const router = express.Router();

router.get('/logout', logoutHandler);
router.get('/login', loginHandler);
router.get('/register', registerHandler);
router.get('/verifySession', verifySessionHandler);

export default router;