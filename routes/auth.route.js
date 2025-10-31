import express from 'express';
const router = express.Router();
import * as authController from '../controllers/auth.controller.js';

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);

export default router;

