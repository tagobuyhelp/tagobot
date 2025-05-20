import express from 'express';
import { getPlatforms, getPlatform } from '../controllers/platform.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All platform routes should be protected

router.get('/', getPlatforms);
router.get('/:name', getPlatform);

export default router;