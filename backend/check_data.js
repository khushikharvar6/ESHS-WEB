const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const appointments = await prisma.appointment.findMany();
  console.log('Appointments:', appointments.length);
  const inquiries = await prisma.inquiry.findMany();
  console.log('Inquiries:', inquiries.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
