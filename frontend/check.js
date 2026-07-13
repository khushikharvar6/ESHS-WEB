const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const tests = await prisma.testMaster.count();
  const packages = await prisma.packageMaster.count();
  const services = await prisma.serviceMaster.count();
  console.log({ tests, packages, services });
}

check().catch(console.error).finally(() => prisma.$disconnect());
