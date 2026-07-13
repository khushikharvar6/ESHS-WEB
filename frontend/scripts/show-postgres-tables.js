const { readFileSync } = require('fs');
const { Pool } = require('pg');

const env = readFileSync('./.env.local', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const [key, ...rest] = line.split('=')
    acc[key.trim()] = rest.join('=').trim()
    return acc
  }, {})

const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

const pool = new Pool({ connectionString: databaseUrl })

async function main() {
  const result = await pool.query(
    "SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
  )
  console.log(JSON.stringify(result.rows, null, 2))
  await pool.end()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
