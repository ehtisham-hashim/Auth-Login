import { Router } from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', verifyToken, logout);
export default router;
