const fs = require('fs')
const path = require('path')
const { randomUUID } = require('crypto')
const { Pool } = require('pg')

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const [key, ...rest] = trimmed.split('=')
    const value = rest.join('=').trim()
    if (key && value && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

const envPath = path.join(process.cwd(), '.env.local')
loadDotEnv(envPath)

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Please add it to .env.local or your environment.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

const resources = [
  'patients',
  'appointments',
  'inquiries',
  'invoices',
  'documents',
  'consultations',
  'ncs',
]

async function ensureTables() {
  for (const resource of resources) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${resource} (
        id text PRIMARY KEY,
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)
  }
}

async function seedData() {
  const dbFile = path.join(process.cwd(), 'data', 'mock-db.json')
  if (!fs.existsSync(dbFile)) {
    console.warn('No mock-db.json found to seed. Skipping data seed.')
    return
  }
  const raw = fs.readFileSync(dbFile, 'utf8')
  const data = JSON.parse(raw)

  for (const resource of resources) {
    await pool.query(`DELETE FROM ${resource}`)
    const items = Array.isArray(data[resource]) ? data[resource] : []
    let count = 0
    for (const item of items) {
      const id = String(item.id ?? item.uhid ?? randomUUID())
      await pool.query(
        `INSERT INTO ${resource} (id, payload) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
        [id, item],
      )
      count += 1
    }
    console.log(`Seeded ${count} rows into ${resource}`)
  }
}

async function showSummary() {
  const summary = {}
  for (const resource of resources) {
    const result = await pool.query(`SELECT COUNT(*) AS count FROM ${resource}`)
    summary[resource] = Number(result.rows[0].count)
  }
  console.log('PostgreSQL seed summary:', summary)
}

async function main() {
  try {
    console.log('Connecting to PostgreSQL...')
    await pool.connect()
    console.log('Ensuring tables exist...')
    await ensureTables()
    console.log('Seeding default data from data/mock-db.json...')
    await seedData()
    await showSummary()
    console.log('PostgreSQL initialization complete.')
  } catch (error) {
    console.error('PostgreSQL initialization failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
