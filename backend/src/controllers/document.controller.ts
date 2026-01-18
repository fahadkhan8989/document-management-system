import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/interfaces';
import { documentService } from '../services/document.service';
import { body } from 'express-validator';
import { BadRequestError } from '../utils/errors';

export class DocumentController {
  async uploadDocument(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new BadRequestError('No file uploaded');
      }

      const { name, categoryId, description } = req.body;
      const userId = req.user!.userId;

      const document = await documentService.uploadDocument(
        req.file,
        userId,
        name,
        parseInt(categoryId),
        description
      );

      res.status(201).json({
        success: true,
        data: {
          documentId: document.id,
          s3Url: document.s3Url,
          name: document.name,
          category: document.category,
        },
        message: 'Document uploaded successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getDocuments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { page, limit, category, search } = req.query;

      const result = await documentService.getDocuments(userId, {
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        category: category ? parseInt(category as string) : undefined,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getDocumentById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id);

      const document = await documentService.getDocumentById(id, userId);

      res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async updateDocument(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id);
      const { name, categoryId, description } = req.body;

      const document = await documentService.updateDocument(id, userId, {
        name,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        description,
      });

      res.status(200).json({
        success: true,
        data: document,
        message: 'Document updated successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  async deleteDocument(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id);

      await documentService.deleteDocument(id, userId);

      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  async downloadDocument(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const id = parseInt(req.params.id);

      const downloadUrl = await documentService.getDownloadUrl(id, userId);

      res.status(200).json({
        success: true,
        data: {
          downloadUrl,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();

export const uploadValidation = [
  body('name').notEmpty().withMessage('Document name is required'),
  body('categoryId').notEmpty().withMessage('Category is required'),
];

export const updateValidation = [
  body('name').optional().notEmpty().withMessage('Document name cannot be empty'),
  body('categoryId').optional().notEmpty().withMessage('Category cannot be empty'),
];
