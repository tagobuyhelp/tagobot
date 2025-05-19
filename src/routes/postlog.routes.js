import express from 'express';
import { 
    getPostLogs, 
    getPostLogById, 
    createPostLog
} from '../controllers/postlog.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPostLogs)
    .post(authorize('admin', 'administrator'), createPostLog);

router.route('/:id')
    .get(getPostLogById);

export default router;