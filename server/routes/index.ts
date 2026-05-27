import { Router } from 'express';
import apiRouter from './api.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

router.use('/', apiRouter);

export default router;
