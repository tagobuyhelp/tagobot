import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
    .get(authorize('admin', 'administrator'), getAllUsers);

router.route('/:id')
    .get(authorize('admin', 'administrator'), getUserById)
    .put(authorize('admin', 'administrator'), updateUser)
    .delete(authorize('admin', 'administrator'), deleteUser);

export default router;