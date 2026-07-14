const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tests = await prisma.testMaster.findMany({
    where: {
      OR: [
        { subcategory: null },
        { serviceType: null }
      ]
    }
  });

  const depts = new Set(tests.map(t => t.department));
  console.log('Departments with missing data:', Array.from(depts));
}

main().catch(console.error).finally(() => prisma.$disconnect());
