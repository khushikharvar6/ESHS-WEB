const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'hemant.chouhan@eshs.in' },
    data: { role: 'MRD' }
  });
  console.log("Updated Hemant to MRD");

  await prisma.user.updateMany({
    where: { email: 'harsh.malviya@eshs.in' },
    data: { role: 'QA' }
  });
  console.log("Updated Harsh to QA");
}

main().catch(console.error).finally(() => prisma.$disconnect());
