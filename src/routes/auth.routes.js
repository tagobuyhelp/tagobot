import express from 'express';
import { 
    register, 
    login, 
    forgotPassword, 
    resetPassword, 
    deleteUser 
} from '../controllers/auth.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.delete('/deleteuser', protect, deleteUser);

export default router;