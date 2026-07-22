const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`UPDATE users SET id = 'PCO001' WHERE email = 'projectcoordinator@eshs.in'`;
  console.log('Successfully updated ID to PCO001');
}

main().catch(console.error).finally(() => prisma.$disconnect());
