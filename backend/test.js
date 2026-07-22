const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.patient.findMany().then(p => {
  console.log('Patients:', p.length);
  console.log(p[0]);
}).catch(console.error).finally(() => prisma.$disconnect());
