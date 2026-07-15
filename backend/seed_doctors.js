const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const frontendDoctors = [
  'Dr. Anand Gadhvi',
  'Dr. Nidhi Desai',
  'Dr. Vidhi Shukla',
  'Dr. Narendra Shah',
  'Dr. Jyoti Shah'
];

async function main() {
  console.log('Clearing existing doctors...');
  await prisma.doctor.deleteMany({});

  console.log('Seeding doctors from frontend list...');
  for (const name of frontendDoctors) {
    const nameParts = name.split(' ');
    // Remove "Dr." from first name if present for cleaner data, or keep it.
    // The frontend just uses the full string.
    const isDr = nameParts[0] === 'Dr.';
    const firstName = isDr ? nameParts[1] : nameParts[0];
    const lastName = isDr ? nameParts.slice(2).join(' ') : nameParts.slice(1).join(' ');

    await prisma.doctor.create({
      data: {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        firstName: firstName,
        lastName: lastName,
        fullName: name,
        specialization: ['General Physician'],
        isActive: true,
      }
    });
    console.log(`Inserted: ${name}`);
  }
  
  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
