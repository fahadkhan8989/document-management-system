import { Router } from 'express';
import { authController, registerValidation, loginValidation } from '../controllers/auth.controller';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', registerValidation, handleValidationErrors, authController.register.bind(authController));
router.post('/login', loginValidation, handleValidationErrors, authController.login.bind(authController));

export default router;
