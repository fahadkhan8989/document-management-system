import { prisma } from '../config/prisma';
import { s3Service } from './s3.service';
import { redisService } from './redis.service';
import { socketService } from './socket.service';
import { DocumentQueryParams, PaginationResult } from '../types/interfaces';
import { UnauthorizedError } from '../utils/errors';
import { verifyDocumentOwnership, ensureResourceExists } from '../utils/authorization';

export class DocumentService {
  async uploadDocument(
    file: Express.Multer.File,
    userId: number,
    name: string,
    categoryId: number,
    description?: string
  ): Promise<any> {
    const { s3Key, s3Url } = await s3Service.uploadFile(file, userId.toString());

    const document = await prisma.document.create({
      data: {
        userId: Number(userId),
        categoryId: Number(categoryId),
        name,
        description,
        fileType: file.mimetype,
        fileSize: file.size,
        s3Key,
        s3Url,
      },
      include: {
        category: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    await redisService.set(
      `DOCUMENT:${document.id}`,
      JSON.stringify(document),
      600
    );

    await redisService.delPattern(`USER_DOCS:${userId}:*`);

    socketService.emitDocumentUploaded(userId.toString(), document);

    return document;
  }

  async getDocuments(
    userId: number,
    params: DocumentQueryParams
  ): Promise<PaginationResult<any>> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `USER_DOCS:${userId}:page:${page}:limit:${limit}:category:${params.category || 'all'}:search:${params.search || ''}`;

    try {
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Redis cache read error:', error);
      // Continue to database query
    }

    const where: any = { userId };

    if (params.category) {
      where.categoryId = Number(params.category);
    }

    if (params.search) {
      where.name = {
        contains: params.search,
      };
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
        include: {
          category: true,
        },
      }),
      prisma.document.count({ where }),
    ]);

    const result = {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    try {
      await redisService.set(cacheKey, JSON.stringify(result), 300);
    } catch (error) {
      console.error('Redis cache write error:', error);
      // Continue without caching
    }

    return result;
  }

  async getDocumentById(documentId: number, userId: number): Promise<any> {
    const cacheKey = `DOCUMENT:${documentId}`;

    try {
      const cached = await redisService.get(cacheKey);
      if (cached) {
        const document = JSON.parse(cached);
        verifyDocumentOwnership(document, userId);
        return document;
      }
    } catch (error: any) {
      if (error instanceof UnauthorizedError) throw error;
      console.error('Redis cache read error:', error);
      // Continue to database query
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        category: true,
      },
    });

    ensureResourceExists(document, 'Document');
    verifyDocumentOwnership(document, userId);

    try {
      await redisService.set(cacheKey, JSON.stringify(document), 600);
    } catch (error) {
      console.error('Redis cache write error:', error);
      // Continue without caching
    }

    return document;
  }

  async updateDocument(
    documentId: number,
    userId: number,
    updates: { name?: string; categoryId?: number; description?: string }
  ): Promise<any> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    ensureResourceExists(document, 'Document');
    verifyDocumentOwnership(document, userId);

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.categoryId && { categoryId: updates.categoryId }),
        ...(updates.description !== undefined && { description: updates.description }),
      },
      include: {
        category: true,
      },
    });

    try {
      await redisService.del(`DOCUMENT:${documentId}`);
      await redisService.delPattern(`USER_DOCS:${userId}:*`);
    } catch (error) {
      console.error('Redis cache invalidation error:', error);
      // Continue without cache invalidation
    }

    socketService.emitDocumentUpdated(userId.toString(), updatedDocument);

    return updatedDocument;
  }

  async deleteDocument(documentId: number, userId: number): Promise<void> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    ensureResourceExists(document, 'Document');
    verifyDocumentOwnership(document, userId);

    try {
      await s3Service.deleteFile(document.s3Key);
    } catch (error) {
      console.error('S3 delete error:', error);
      // Continue with database deletion even if S3 fails
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    try {
      await redisService.del(`DOCUMENT:${documentId}`);
      await redisService.delPattern(`USER_DOCS:${userId}:*`);
    } catch (error) {
      console.error('Redis cache invalidation error:', error);
      // Continue without cache invalidation
    }

    socketService.emitDocumentDeleted(userId.toString(), documentId.toString());
  }

  async getDownloadUrl(documentId: number, userId: number): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    ensureResourceExists(document, 'Document');
    verifyDocumentOwnership(document, userId);

    const downloadUrl = await s3Service.getSignedDownloadUrl(document.s3Key, 3600); // 1 hour expiry

    return downloadUrl;
  }
}

export const documentService = new DocumentService();
