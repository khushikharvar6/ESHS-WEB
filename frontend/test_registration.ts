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
    const dbData = {
        uhid: 'ES2026-' + String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0'),
        firstName: 'Test',
        lastName: 'Patient',
        mobileNo: '9999999999',
        insuranceProvider: 'LIC' // THIS IS THE CULPRIT!
    }
    
    console.log("Attempting to create patient...")
    const patient = await prisma.patient.create({ data: dbData as any })
    console.log("Success!", patient)
  } catch (error) {
    console.error("Prisma Error:", error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()
