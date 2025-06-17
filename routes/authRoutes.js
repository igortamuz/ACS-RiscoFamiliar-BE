import express from 'express';
import authController from '../controllers/authController.js'; // Note: .js extension might be needed

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/request-password-reset', authController.resetPassword);

export default router;