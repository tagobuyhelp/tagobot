import express from 'express';
import { 
    getSchedules, 
    getScheduleById,
    getScheduleByService
} from '../controllers/schedule.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSchedules);

router.route('/:id')
    .get(getScheduleById);

router.route('/service/:serviceId')
    .get(getScheduleByService);

export default router;