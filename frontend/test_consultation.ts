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
  console.log('Attempting to create consultation...')
  const uhid = 'ES2026-720988' // The test patient I just created
  
  try {
    const consultation = await prisma.consultation.create({
      data: {
        uhid: uhid,
        doctor: 'Dr. Anand Gadhvi',
        service: 'Consultation',
        date: new Date().toISOString(),
        vitals: {
          bp: '120/80',
          pulse: '72',
          temp: '98.6',
          weight: '70'
        },
        chiefComplaint: 'Headache for 2 days',
        diagnosis: 'Migraine',
        treatmentNotes: 'Rest in a dark room.',
        prescription: 'Paracetamol 500mg SOS',
        medicines: [{
          name: 'Paracetamol',
          dosage: '500mg',
          duration: '3 days',
          instructions: 'SOS'
        }]
      }
    })
    console.log('Success!', consultation)
  } catch (e) {
    console.error('Error creating consultation:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
