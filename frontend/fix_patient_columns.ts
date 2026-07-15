import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

let connectionString = process.env.DATABASE_URL || ''
connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '').replace(/[?&]sslaccept=[^&]*/g, '')
if (connectionString.endsWith('?')) connectionString = connectionString.slice(0, -1)

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    const columns = [
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "salutation" TEXT DEFAULT \'\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "middleName" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "age" INTEGER DEFAULT 0;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "alternateMobile" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "emailAddress" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "residentialAddress" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT \'India\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "pincode" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "emergencyContactName" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "emergencyRelationship" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "emergencyPhoneNumber" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "patientCategory" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "careType" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "assignedDepartmentServices" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "assignedDepartment" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "service" TEXT DEFAULT \'\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "registeredOn" TEXT DEFAULT \'\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "lastVisit" TEXT DEFAULT \'\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT \'Active\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "initials" TEXT DEFAULT \'\';',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "inquiryId" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "appointmentId" TEXT;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "vip" BOOLEAN DEFAULT false;',
      'ALTER TABLE "patients" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;'
    ];

    for (const sql of columns) {
      console.log("Executing:", sql);
      await prisma.$executeRawUnsafe(sql);
    }
    console.log("All columns added successfully!");
  } catch (error) {
    console.error("Prisma Error:", error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
