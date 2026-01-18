import { PrismaClient } from "@prisma/client";
import { redisService } from "../src/services/redis.service";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create initial categories
  const categories = [
    { name: "Documents", color: "#3B82F6" },
    { name: "Images", color: "#10B981" },
    { name: "Reports", color: "#F59E0B" },
    { name: "Contracts", color: "#EF4444" },
    { name: "Invoices", color: "#8B5CF6" },
    { name: "Presentations", color: "#EC4899" },
    { name: "Spreadsheets", color: "#14B8A6" },
    { name: "Other", color: "#6B7280" },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name },
    });

    if (!existing) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Created category: ${category.name}`);
    } else {
      console.log(`Category already exists: ${category.name}`);
    }
  }

  // Clear Cache
  const cacheKey = "CATEGORIES:ALL";
  try {
    await redisService.del(cacheKey);
    console.log("Cleared cache key:", cacheKey);
  } catch (error) {
    console.error("Redis cache read error:", error);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
