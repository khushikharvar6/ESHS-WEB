const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { email: 'harsh.malviya@eshs.in', role: 'OPD' },
  { email: 'hemant.chouhan@eshs.in', role: 'OPD' },
  { email: 'devanshi.kharvar@eshs.in', role: 'MRD' },
  { email: 'aditi.jariwala@eshs.in', role: 'QA' },
  { email: 'admin@eshs.in', role: 'ADMIN' },
  { email: 'priyank.mohadikar@eshs.in', role: 'FRONT_DESK' },
  { email: 'hiral.monpara@eshs.in', role: 'FRONT_DESK' }
];

async function updateRoles() {
  for (const update of updates) {
    try {
      await prisma.user.update({
        where: { email: update.email },
        data: { role: update.role }
      });
      console.log(`Updated ${update.email} to ${update.role}`);
    } catch (e) {
      console.log(`Failed to update ${update.email}: ${e.message}`);
    }
  }
}

updateRoles().finally(() => prisma.$disconnect());
