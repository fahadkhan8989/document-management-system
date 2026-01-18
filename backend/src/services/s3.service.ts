import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Client, S3_BUCKET } from '../config/s3';
import { getFileExtension } from '../utils/fileValidation.utils';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class S3Service {
  private async executeWithRetry<T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let i = 0; i < retries; i++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.error(`S3 operation failed (attempt ${i + 1}/${retries}):`, error.message);

        // Don't retry on certain errors (e.g., 404, 403)
        if (error.statusCode === 404 || error.statusCode === 403) {
          throw error;
        }

        if (i < retries - 1) {
          const delay = RETRY_DELAY * Math.pow(2, i); // Exponential backoff
          await sleep(delay);
        }
      }
    }

    throw lastError || new Error('S3 operation failed after retries');
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string
  ): Promise<{ s3Key: string; s3Url: string }> {
    const timestamp = Date.now();
    const fileExt = getFileExtension(file.mimetype);
    const s3Key = `users/${userId}/${timestamp}-${file.originalname}`;

    return await this.executeWithRetry(async () => {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: file.buffer,
          ContentType: file.mimetype,
        },
      });

      await upload.done();

      const s3Url = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

      return { s3Key, s3Url };
    });
  }

  async deleteFile(s3Key: string): Promise<void> {
    await this.executeWithRetry(async () => {
      const command = new DeleteObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });

      await s3Client.send(command);
    });
  }

  async getSignedDownloadUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    return await this.executeWithRetry(async () => {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });
      return url;
    });
  }
}

export const s3Service = new S3Service();
