const fs = require('fs');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function importCSV(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isFirstLine = true;
  let count = 0;
  
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue; // Skip header
    }
    
    // Split safely handling quotes if necessary. For simple CSVs:
    const parts = line.split(',');
    if (parts.length < 13) continue;

    const id = parts[0];
    const itemType = parts[1];
    const category = parts[2];
    const subcategory = parts[3];
    const serviceType = parts[4];
    const department = parts[5];
    const name = parts[6];
    const price = parseFloat(parts[7]);
    const taxRate = parseFloat(parts[8]);
    const sourceUrl = parts[9];
    const isActive = parts[10].toLowerCase() === 'true';

    try {
      await prisma.testMaster.upsert({
        where: { id },
        update: {
          itemType,
          category,
          subcategory,
          serviceType,
          department,
          name,
          price,
          taxRate,
          sourceUrl,
          isActive
        },
        create: {
          id,
          itemType,
          category,
          subcategory,
          serviceType,
          department,
          name,
          price,
          taxRate,
          sourceUrl,
          isActive
        }
      });
      count++;
      if (count % 50 === 0) console.log(`Processed ${count} records...`);
    } catch (err) {
      console.error(`Error on ID ${id}:`, err);
    }
  }
  
  console.log(`Successfully imported/updated ${count} records from CSV.`);
}

importCSV('C:\\Users\\ESHS INTERN\\Downloads\\test_masters_updated_service.csv')
  .catch(console.error)
  .finally(() => prisma.$disconnect());
