import { prisma } from './prisma';

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (): Promise<void> => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await prisma.$connect();
      console.log('MySQL Database Connected via Prisma');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1}/${MAX_RETRIES} failed:`, error);
      if (i < MAX_RETRIES - 1) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await sleep(RETRY_DELAY);
      } else {
        console.error('Failed to connect to database after all retries');
        process.exit(1);
      }
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
};
