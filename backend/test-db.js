const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT datname FROM pg_database;`;
    console.log(res);
  } catch(e) { console.error(e); } finally { await prisma.$disconnect(); }
}
main();
