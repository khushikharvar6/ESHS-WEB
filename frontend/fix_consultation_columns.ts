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
      'ALTER TABLE "Consultation" ADD COLUMN IF NOT EXISTS "vitals" JSONB;',
      'ALTER TABLE "Consultation" ADD COLUMN IF NOT EXISTS "medicines" JSONB;'
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
