import { prisma } from '../config/prisma';
import { redisService } from './redis.service';
import { getIO } from '../config/socket';

export class CategoryService {
  async getAllCategories(): Promise<any[]> {
    const cacheKey = 'CATEGORIES:ALL';

    try {
      const cached = await redisService.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Redis cache read error:', error);
      // Continue to database query
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    try {
      await redisService.set(cacheKey, JSON.stringify(categories), 3600); // 1 hour TTL
    } catch (error) {
      console.error('Redis cache write error:', error);
      // Continue without caching
    }

    return categories;
  }

  async createCategory(name: string, color?: string): Promise<any> {
    const category = await prisma.category.create({
      data: {
        name,
        color: color || '#3B82F6',
      },
    });

    try {
      await redisService.delPattern('CATEGORIES:*');
    } catch (error) {
      console.error('Redis cache invalidation error:', error);
      // Continue without cache invalidation
    }

    // Emit real-time event (broadcast to all users)
    const io = getIO();
    io.emit('category:created', {
      categoryId: category.id,
      name: category.name,
      color: category.color,
    });

    return category;
  }

  async getCategoryById(id: number): Promise<any> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }
}

export const categoryService = new CategoryService();
