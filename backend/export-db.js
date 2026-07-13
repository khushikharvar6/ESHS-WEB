const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportData() {
  try {
    const users = await prisma.$queryRaw`SELECT * FROM "users"`;
    const patients = await prisma.$queryRaw`SELECT * FROM "Patient"`;
    
    fs.writeFileSync('db-export.json', JSON.stringify({ users, patients }, null, 2));
    console.log("Exported data successfully to db-export.json");
  } catch(e) {
    console.error("Export failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
