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
    try {
      // Upsert raw
      const exists = await prisma.$queryRaw`SELECT id FROM users WHERE email = ${u.email}`;
      if (exists.length > 0) {
        await prisma.$executeRaw`
          UPDATE users 
          SET role = ${u.role}, 
              first_name = COALESCE(first_name, ${u.firstName}), 
              "firstName" = ${u.firstName}
          WHERE email = ${u.email}
        `;
        console.log(`Updated ${u.email}`);
      } else {
        await prisma.$executeRaw`
          INSERT INTO users (id, email, password, role, first_name, last_name, "firstName", "lastName", is_active)
          VALUES (gen_random_uuid(), ${u.email}, ${defaultPassword}, ${u.role}, ${u.firstName}, ${u.lastName}, ${u.firstName}, ${u.lastName}, true)
        `;
        console.log(`Inserted ${u.email}`);
      }
    } catch (e) {
      console.log('Error on ' + u.email + ': ' + e.message);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
