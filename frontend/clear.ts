import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting DB cleanup...")

  await prisma.feedbackRating.deleteMany({})
  await prisma.feedback.deleteMany({})
  
  await prisma.nonConformance.deleteMany({})
  await prisma.invoice.deleteMany({})
  await prisma.consultation.deleteMany({})
  await prisma.appointment.deleteMany({})
  await prisma.inquiry.deleteMany({})
  await prisma.patientDocument.deleteMany({})
  
  await prisma.patientInsurance.deleteMany({})
  await prisma.patientCorporate.deleteMany({})
  await prisma.patient.deleteMany({})

  console.log("✅ All testing data cleared successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
