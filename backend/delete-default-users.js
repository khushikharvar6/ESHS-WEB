const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emailsToDelete = ['admin@eshealth.in', 'frontoffice@eshealth.in'];
  
  for (const email of emailsToDelete) {
    try {
      await prisma.user.delete({
        where: { email },
      });
      console.log(`Successfully deleted ${email}`);
    } catch (e) {
      if (e.code === 'P2025') {
        console.log(`${email} already deleted or not found.`);
      } else {
        console.error(`Error deleting ${email}:`, e);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
