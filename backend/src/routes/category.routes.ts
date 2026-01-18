import { Router } from 'express';
import { categoryController, createCategoryValidation } from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const router = Router();

router.get('/', authMiddleware, categoryController.getAllCategories.bind(categoryController));
router.post(
  '/',
  authMiddleware,
  createCategoryValidation,
  handleValidationErrors,
  categoryController.createCategory.bind(categoryController)
);

export default router;
