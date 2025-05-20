import express from 'express';
import { getCredentials, getCredentialById, createCredential, updateCredential, deleteCredential } from '../controllers/credential.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all credential routes
router.use(protect);

router.route('/')
    .get(getCredentials)
    .post(createCredential);

router.route('/:id')
    .get(getCredentialById)
    .put(updateCredential)
    .delete(deleteCredential);

export default router;