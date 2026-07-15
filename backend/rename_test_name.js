const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`ALTER TABLE "test_masters" RENAME COLUMN "Test_name" TO "name";`);
  console.log("Column renamed successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
