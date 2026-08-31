import { Router } from 'express';
import { getProfile, getDashboard } from '../controllers/protected.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verifyToken);
router.get('/profile', getProfile);
router.get('/dashboard', getDashboard);
export default router;
