const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: { in: ['devanshi.kharvar@eshs.in', 'aditi.jariwala@eshs.in'] } },
    data: { role: 'OPD' }
  });
  console.log("Updated Devanshi and Aditi to OPD");
}

main().catch(console.error).finally(() => prisma.$disconnect());
