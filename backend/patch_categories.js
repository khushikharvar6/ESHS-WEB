const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const departments = {
    'PATHOLOGY': { subcat: 'General Pathology', servType: 'Laboratory Test' },
    'RADIOLOGY': { subcat: 'General Radiology', servType: 'Imaging' },
    'CARDIOLOGY': { subcat: 'General Cardiology', servType: 'Diagnostic' },
    'PHYSIOTHERAPY': { subcat: 'General Physiotherapy', servType: 'Therapy' },
    'DOCTOR_CONSULTATION': { subcat: 'General Consultation', servType: 'Consultation' },
    'PULMONOLOGY': { subcat: 'General Pulmonology', servType: 'Diagnostic' },
  };

  const tests = await prisma.testMaster.findMany({
    where: {
      OR: [
        { subcategory: null },
        { serviceType: null }
      ]
    }
  });

  console.log(`Found ${tests.length} tests to update...`);

  let count = 0;
  for (const t of tests) {
    const defaults = departments[t.department] || { subcat: 'General', servType: 'Standard' };
    
    await prisma.testMaster.update({
      where: { id: t.id },
      data: {
        subcategory: t.subcategory || defaults.subcat,
        serviceType: t.serviceType || defaults.servType
      }
    });
    count++;
  }

  console.log(`Successfully updated ${count} tests!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
