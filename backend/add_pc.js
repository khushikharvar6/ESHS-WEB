const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Eshs@2025-26', 10);

  await prisma.user.upsert({
    where: { email: 'projectcoordinator@eshs.in' },
    update: { 
      role: 'PROJECT_COORDINATOR', 
      password: password,
      firstName: 'Project',
      lastName: 'Coordinator'
    },
    create: {
      email: 'projectcoordinator@eshs.in',
      password: password,
      role: 'PROJECT_COORDINATOR',
      firstName: 'Project',
      lastName: 'Coordinator',
      updatedAt: new Date()
    }
  });
  console.log(`Successfully added/updated projectcoordinator@eshs.in`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
