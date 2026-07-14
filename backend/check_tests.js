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

  console.log(`Found ${tests.length} tests missing subcategory or serviceType.`);
  for (const t of tests.slice(0, 50)) {
    console.log(`${t.id} - ${t.name} (Dept: ${t.department})`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
