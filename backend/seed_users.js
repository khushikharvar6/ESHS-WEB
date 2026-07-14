const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const users = [
    { firstName: 'Khushi', lastName: '', email: 'khushi@eshs.in', role: 'ADMIN' },
    { firstName: 'Hiral', lastName: '', email: 'hiral@eshs.in', role: 'FRONT_DESK' },
    { firstName: 'Priyank', lastName: '', email: 'priyank@eshs.in', role: 'FRONT_DESK' },
    { firstName: 'Hemant', lastName: '', email: 'hemant@eshs.in', role: 'MRD' },
    { firstName: 'Harsh', lastName: '', email: 'harsh@eshs.in', role: 'QA' },
    { firstName: 'OPD', lastName: 'User 1', email: 'opd1@eshs.in', role: 'OPD' },
    { firstName: 'OPD', lastName: 'User 2', email: 'opd2@eshs.in', role: 'OPD' },
  ];

  const defaultPassword = await bcrypt.hash('password123', 10);

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, firstName: u.firstName },
      create: {
        email: u.email,
        password: defaultPassword,
        role: u.role,
        firstName: u.firstName,
        lastName: u.lastName,
        updatedAt: new Date()
      }
    });
    console.log(`Upserted ${u.email} with role ${u.role}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
