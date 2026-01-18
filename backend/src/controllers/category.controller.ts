import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/interfaces';
import { categoryService } from '../services/category.service';
import { body } from 'express-validator';
import { AppError } from '../utils/errors';

export class CategoryController {
  async getAllCategories(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.getAllCategories();

      res.status(200).json({
        success: true,
        data: {
          categories: categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            color: cat.color,
          })),
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createCategory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, color } = req.body;
      const category = await categoryService.createCategory(name, color);

      res.status(201).json({
        success: true,
        data: {
          id: category.id,
          name: category.name,
          color: category.color,
        },
        message: 'Category created successfully',
      });
    } catch (error: any) {
      if (error.message.includes('Unique constraint')) {
        next(new AppError('Category with this name already exists', 409, 'DUPLICATE_CATEGORY'));
        return;
      }
      next(error);
    }
  }
}

export const categoryController = new CategoryController();

export const createCategoryValidation = [
  body('name').notEmpty().withMessage('Category name is required'),
  body('color').optional().isHexColor().withMessage('Color must be a valid hex color'),
];
