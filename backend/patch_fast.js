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

  for (const [dept, defaults] of Object.entries(departments)) {
    const res = await prisma.testMaster.updateMany({
      where: {
        department: dept,
        OR: [
          { subcategory: null },
          { serviceType: null }
        ]
      },
      data: {
        subcategory: defaults.subcat,
        serviceType: defaults.servType
      }
    });
    console.log(`Updated ${res.count} records for ${dept}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
