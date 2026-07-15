const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Copy data from old columns to new columns
  console.log("Copying data...");
  await prisma.$executeRawUnsafe(`UPDATE "users" SET "first_name" = "firstName" WHERE "firstName" IS NOT NULL;`);
  await prisma.$executeRawUnsafe(`UPDATE "users" SET "last_name" = "lastName" WHERE "lastName" IS NOT NULL;`);
  await prisma.$executeRawUnsafe(`UPDATE "users" SET "is_active" = "isActive" WHERE "isActive" IS NOT NULL;`);
  await prisma.$executeRawUnsafe(`UPDATE "users" SET "created_at" = "createdAt" WHERE "createdAt" IS NOT NULL;`);
  await prisma.$executeRawUnsafe(`UPDATE "users" SET "updated_at" = "updatedAt" WHERE "updatedAt" IS NOT NULL;`);
  await prisma.$executeRawUnsafe(`UPDATE "users" SET "last_login_at" = "lastLogin" WHERE "lastLogin" IS NOT NULL;`);

  // 2. Drop the old columns to remove duplicates
  console.log("Dropping old duplicate columns...");
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName";`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName";`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "isActive";`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "createdAt";`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "updatedAt";`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lastLogin";`);
  } catch (e) {
    console.error("Error dropping columns:", e);
  }

  console.log("Migration complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
