import express from 'express';
import { 
    getCredentials, 
    getCredentialById, 
    createCredential,
    updateCredential,
    deleteCredential
} from '../controllers/credential.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'administrator'));

router.route('/')
    .get(getCredentials)
    .post(createCredential);

router.route('/:id')
    .get(getCredentialById)
    .put(updateCredential)
    .delete(deleteCredential);

export default router;