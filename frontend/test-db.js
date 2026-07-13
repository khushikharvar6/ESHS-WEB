const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    await prisma.patient.create({
      data: {
        name: 'Test',
        age: 31,
        gender: 'Female',
        phone: '123'
      }
    });
    console.log('Success');
  } catch (e) {
    console.error('Prisma Error:', e.message);
  }
}
main().finally(() => prisma.$disconnect());
