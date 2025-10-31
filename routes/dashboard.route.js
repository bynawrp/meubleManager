import express from 'express';
const router = express.Router();
import * as dashboardController from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

router.use(requireAuth);
router.get('/', dashboardController.getDashboard);

export default router;

