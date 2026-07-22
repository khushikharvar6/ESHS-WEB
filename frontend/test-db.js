const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  console.log('Patients:', await prisma.patient.count()); 
  console.log('Feedback:', await prisma.feedback.count()); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
