import { Router } from 'express';
import { getInfo } from '../controllers/public.controller.js';
const router = Router();
router.get('/info', getInfo);
export default router;
