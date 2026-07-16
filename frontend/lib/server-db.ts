import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Ensure the connection string falls back to a valid dummy URL during static generation (e.g. next build on Vercel)
// otherwise `new Pool()` will throw if the connection string is completely empty.
let connectionString = process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy:5432/dummy'

// Configure pg.Pool with robust settings for Vercel/Supabase
const pool = globalForPrisma.pool ?? new Pool({
  connectionString,
  max: 10, // Max 10 connections per serverless instance to prevent connection starvation
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  // Ensure SSL is explicitly required for remote database connections (like Supabase)
  ssl: { rejectUnauthorized: false }
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pool = pool
}

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
// Connect map for mapping generic resources to prisma models
const PRISMA_MAP: Record<string, any> = {
  patients: prisma.patient,
  appointments: prisma.appointment,
  inquiries: prisma.inquiry,
  invoices: prisma.invoice,
  documents: prisma.patientDocument,
  consultations: prisma.consultation,
  ncs: prisma.nonConformance,
  test_masters: prisma.testMaster,
  service_masters: prisma.serviceMaster,
  package_masters: prisma.packageMaster,
  users: prisma.user,
  feedback: prisma.feedback,
}

export type DbResource = keyof typeof PRISMA_MAP

export async function listResource(resource: DbResource) {
  const model = PRISMA_MAP[resource]
  if (!model) return []
  if (resource === 'invoices') {
    return await model.findMany({ orderBy: { createdAt: 'desc' } })
  }
  return await model.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function createResource<T extends Record<string, any>>(
  resource: DbResource,
  input: T,
) {
  const model = PRISMA_MAP[resource]
  if (!model) throw new Error(`Unknown resource ${resource}`)

  // Ensure id is a string if provided
  const data = { ...input }
  if ((data as any).id) (data as any).id = String((data as any).id)
  
  return await model.create({ data })
}

export async function updateResource(
  resource: DbResource,
  id: string,
  patch: Record<string, any>,
) {
  const model = PRISMA_MAP[resource]
  if (!model) throw new Error(`Unknown resource ${resource}`)

  return await model.update({
    where: { id: String(id) },
    data: patch,
  })
}

export async function deleteResource(resource: DbResource, id: string) {
  const model = PRISMA_MAP[resource]
  if (!model) throw new Error(`Unknown resource ${resource}`)

  await model.delete({
    where: { id: String(id) },
  })
  
  return { deleted: true }
}

export async function getDatabaseSummary() {
  const counts = await Promise.all([
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.inquiry.count(),
    prisma.invoice.count(),
    prisma.patientDocument.count(),
    prisma.nonConformance.count({ where: { status: 'OPEN' } })
  ])

  // Fake summary calculation (add up logic based on real DB if needed)
  return {
    patients: counts[0],
    appointments: counts[1],
    inquiries: counts[2],
    invoices: counts[3],
    documents: counts[4],
    openNcs: counts[5],
    collected: 0,
    outstanding: 0,
  }
}
