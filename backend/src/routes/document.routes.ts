import { Router } from 'express';
import { documentController, uploadValidation, updateValidation } from '../controllers/document.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { handleValidationErrors } from '../middlewares/validation.middleware';

const router = Router();

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  uploadValidation,
  handleValidationErrors,
  documentController.uploadDocument.bind(documentController)
);

router.get(
  '/',
  authMiddleware,
  documentController.getDocuments.bind(documentController)
);

router.get(
  '/:id/download',
  authMiddleware,
  documentController.downloadDocument.bind(documentController)
);

router.get(
  '/:id',
  authMiddleware,
  documentController.getDocumentById.bind(documentController)
);

router.put(
  '/:id',
  authMiddleware,
  updateValidation,
  handleValidationErrors,
  documentController.updateDocument.bind(documentController)
);

router.delete(
  '/:id',
  authMiddleware,
  documentController.deleteDocument.bind(documentController)
);

export default router;
