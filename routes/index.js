import express from 'express';
const router = express.Router();

import authRoutes from './auth.route.js';
import dashboardRoutes from './dashboard.route.js';
import meublesRoutes from './meubles.route.js';
import materiauxRoutes from './materiaux.route.js';
import apiRoutes from './api.route.js';

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/meubles', meublesRoutes);
router.use('/materiaux', materiauxRoutes);
router.use('/api', apiRoutes);

router.get('/', (req, res) => {
    if (req.session.user) res.redirect('/dashboard');
    else res.redirect('/auth/login');
});

export default router;

