import { getIO } from '../config/socket';
import { IDocument } from '../types/interfaces';

export class SocketService {
  emitDocumentUploaded(userId: string, document: any): void {
    const io = getIO();
    io.to(`user:${userId}`).emit('document:uploaded', {
      documentId: document.id,
      name: document.name,
      category: document.category,
    });
  }

  emitDocumentUpdated(userId: string, document: any): void {
    const io = getIO();
    io.to(`user:${userId}`).emit('document:updated', {
      documentId: document.id,
      name: document.name,
      category: document.category,
      description: document.description,
    });
  }

  emitDocumentDeleted(userId: string, documentId: string): void {
    const io = getIO();
    io.to(`user:${userId}`).emit('document:deleted', {
      documentId,
    });
  }
}

export const socketService = new SocketService();
