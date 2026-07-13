const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importData() {
  try {
    const data = JSON.parse(fs.readFileSync('db-export.json', 'utf8'));
    
    // Import users
    for (const u of data.users) {
      try {
        await prisma.user.create({
          data: {
            id: u.id,
            email: u.email,
            password: u.password,
            firstName: u.first_name,
            lastName: u.last_name,
            phone: u.phone,
            isActive: u.is_active,
            department: u.department,
            role: u.role || 'FRONT_OFFICE',
          }
        });
        console.log("Imported user", u.email);
      } catch (e) {
        console.error("Failed to import user", u.email, e.message);
      }
    }
    
    // Import patients
    for (const p of data.patients) {
      try {
        const parts = p.name ? p.name.split(' ') : ['Unknown'];
        const firstName = parts[0];
        const lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Unknown';
        
        await prisma.patient.create({
          data: {
            id: p.id,
            uhid: p.uhid,
            firstName: firstName,
            lastName: lastName,
            gender: p.gender === 'Male' ? 'MALE' : (p.gender === 'Female' ? 'FEMALE' : 'OTHER'),
            mobile: p.phone || "0000000000",
            age: p.age || 0,
            dateOfBirth: new Date(),
          }
        });
        console.log("Imported patient", p.name);
      } catch (e) {
        console.error("Failed to import patient", p.name, e.message);
      }
    }
    
    console.log("Import finished.");
  } catch(e) {
    console.error("Import failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
