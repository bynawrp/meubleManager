import express from 'express';
const router = express.Router();
import * as meublesController from '../controllers/meubles.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

router.use(requireAuth);
router.get('/', meublesController.getMeubles);
router.get('/new', meublesController.getNewMeuble);
router.post('/', meublesController.postMeuble);
router.get('/:id', meublesController.getMeuble);

export default router;

