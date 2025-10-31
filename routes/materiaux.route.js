import express from 'express';
const router = express.Router();
import * as materiauxController from '../controllers/materiaux.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

router.use(requireAuth);
router.get('/', materiauxController.getMateriaux);
router.get('/new', materiauxController.getNewMateriau);
router.post('/', materiauxController.postMateriau);
router.get('/tag/:tag', materiauxController.getByTag);
router.get('/:id/edit', materiauxController.getEditMateriau);
router.put('/:id', materiauxController.putMateriau);
router.get('/:id', materiauxController.getMateriau);

export default router;

