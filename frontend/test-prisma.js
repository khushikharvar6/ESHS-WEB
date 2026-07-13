const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const pt = await prisma.patient.create({
      data: {
        salutation: "Mr.",
        firstName: "John",
        middleName: "A.",
        lastName: "Doe",
        age: 30,
        gender: "Male",
        mobileNo: "9876543210",
        emailAddress: "test@example.com",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",
        emergencyContactName: "Jane Doe",
        emergencyRelationship: "Sibling",
        emergencyPhoneNumber: "9876543211",
        careType: "OPD",
        patientCategory: "Walk-in"
      }
    });
    console.log("Success:", pt);
  } catch (err) {
    console.error("Prisma Error:", err);
  }
}

run().finally(() => prisma.$disconnect());
