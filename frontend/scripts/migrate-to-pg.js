/**
 * Migrate all 30 patients (and other data) from data/mock-db.json into PostgreSQL eshs.
 *
 * - patients table → relational columns (Prisma schema)
 * - appointments, inquiries, invoices, documents, consultations, ncs → (id, payload JSONB)
 * - test_masters, service_masters, package_masters, users → already managed by backend, skip
 *
 * Usage:  node scripts/migrate-to-pg.js
 */

const fs = require('fs')
const path = require('path')
const { Pool } = require('pg')

const DB_URL = 'postgres://postgres:root@localhost:5432/eshs'
const MOCK_DB_PATH = path.join(__dirname, '..', 'data', 'mock-db.json')

/* ── Enum maps: frontend display value → PostgreSQL enum value ── */

const GENDER_MAP = {
  'Male': 'MALE', 'Female': 'FEMALE', 'Other': 'OTHER',
}
const BLOOD_GROUP_MAP = {
  'A+': 'A_POS', 'A-': 'A_NEG', 'B+': 'B_POS', 'B-': 'B_NEG',
  'AB+': 'AB_POS', 'AB-': 'AB_NEG', 'O+': 'O_POS', 'O-': 'O_NEG',
}
const MARITAL_MAP = {
  'Single': 'SINGLE', 'Married': 'MARRIED', 'Divorced': 'DIVORCED', 'Widowed': 'WIDOWED',
}
const RELATIONSHIP_MAP = {
  'Father': 'FATHER', 'Mother': 'MOTHER', 'Husband': 'HUSBAND', 'Wife': 'WIFE',
  'Son': 'SON', 'Daughter': 'DAUGHTER', 'Brother': 'BROTHER', 'Sister': 'SISTER',
  'Friend': 'FRIEND', 'Relative': 'RELATIVE', 'Other': 'OTHER',
}
const PATIENT_CATEGORY_MAP = {
  'Walk-In': 'WALK_IN', 'Insurance': 'INSURANCE', 'Corporate': 'CORPORATE',
  'Health Camp': 'HEALTH_CAMP', 'Referral': 'REFERRAL', 'Existing Patient': 'EXISTING_PATIENT',
}
const CARE_TYPE_MAP = {
  'OPD': 'OPD', 'Day Care': 'DAY_CARE', 'IPD': 'IPD',
}
const SERVICE_MAP = {
  'Doctor Consultation': 'DOCTOR_CONSULTATION', 'Cardiology': 'CARDIOLOGY',
  'Pulmonology': 'PULMONOLOGY', 'Radiology': 'RADIOLOGY',
  'Pathology': 'PATHOLOGY', 'Sample Collection': 'SAMPLE_COLLECTION',
  'Dental': 'DENTAL', 'Ophthalmology': 'OPHTHALMOLOGY',
  'Home Healthcare': 'HOME_HEALTHCARE', 'Day Care': 'DAY_CARE',
  'Vaccination': 'VACCINATION', 'Physiotherapy': 'PHYSIOTHERAPY',
}

function parseDate(str) {
  if (!str) return null
  const d = new Date(str)
  if (!isNaN(d.getTime())) return d
  const parts = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/)
  if (parts) return new Date(`${parts[2]} ${parts[1]}, ${parts[3]}`)
  return null
}

function splitName(fullName) {
  const cleaned = (fullName || '').replace(/^(Mr|Mrs|Ms|Dr|Master|Baby)\.?\s+/i, '').trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { first: 'Unknown', middle: '', last: '' }
  if (parts.length === 1) return { first: parts[0], middle: '', last: '' }
  if (parts.length === 2) return { first: parts[0], middle: '', last: parts[1] }
  return { first: parts[0], middle: parts.slice(1, -1).join(' '), last: parts[parts.length - 1] }
}

// Tables that use the (id, payload JSONB) format
const JSONB_TABLES = ['appointments', 'inquiries', 'invoices', 'documents', 'consultations', 'ncs']

async function main() {
  console.log('Reading mock-db.json ...')
  const raw = fs.readFileSync(MOCK_DB_PATH, 'utf8')
  const db = JSON.parse(raw)

  const pool = new Pool({ connectionString: DB_URL })
  console.log('Connected to PostgreSQL\n')

  // ─── Migrate patients into relational schema ───
  const patients = db.patients || []
  console.log(`Migrating ${patients.length} patients ...`)

  let patientCount = 0
  for (const p of patients) {
    const { first, middle, last } = splitName(p.name)
    const dob = parseDate(p.dob) || new Date('1990-01-01')  // NOT NULL — fallback

    // Default to 'OPD' if careType is missing (not-null column)
    const careType = CARE_TYPE_MAP[p.careType] || 'OPD'
    const patientCategory = PATIENT_CATEGORY_MAP[p.patientCategory] || 'WALK_IN'
    const assignedDept = SERVICE_MAP[p.service] || SERVICE_MAP[p.assignedDepartment] || 'DOCTOR_CONSULTATION'

    const values = [
      p.uhid || p.id,                                        // $1  id
      p.uhid || p.id,                                        // $2  uhid
      first,                                                 // $3  firstName
      middle || null,                                        // $4  middleName
      last || null,                                          // $5  lastName
      p.salutation || null,                                  // $6  salutation
      dob,                                                   // $7  dateOfBirth
      p.age || null,                                         // $8  age
      GENDER_MAP[p.gender] || 'OTHER',                       // $9  gender
      BLOOD_GROUP_MAP[p.bloodGroup] || null,                 // $10 bloodGroup
      MARITAL_MAP[p.maritalStatus] || null,                  // $11 maritalStatus
      p.phone || null,                                       // $12 mobile
      null,                                                  // $13 alternateMobile
      p.email || null,                                       // $14 email
      p.address || null,                                     // $15 residentialAddress
      p.city || null,                                        // $16 city
      p.state || null,                                       // $17 state
      p.country || 'India',                                   // $18 country (NOT NULL)
      p.pincode || null,                                     // $19 pincode
      p.emergencyName || null,                               // $20 emergencyName
      p.emergencyPhone || null,                              // $21 emergencyPhone
      RELATIONSHIP_MAP[p.emergencyRelationship] || null,     // $22 emergencyRelationship
      patientCategory,                                       // $23 patientCategory
      careType,                                              // $24 careType
      assignedDept,                                          // $25 assignedDepartment
      p.uhid || p.id,                                        // $26 patientId
      p.status !== 'Inactive',                               // $27 isActive
      null,                                                  // $28 registeredById
    ]

    try {
      await pool.query(`
        INSERT INTO patients (
          id, uhid, "firstName", "middleName", "lastName", salutation,
          "dateOfBirth", age, gender, "bloodGroup", "maritalStatus",
          mobile, "alternateMobile", email,
          "residentialAddress", city, state, country, pincode,
          "emergencyName", "emergencyPhone", "emergencyRelationship",
          "patientCategory", "careType", "assignedDepartment",
          "patientId", "isActive", "registeredById",
          "createdAt", "updatedAt"
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11,
          $12, $13, $14,
          $15, $16, $17, $18, $19,
          $20, $21, $22,
          $23, $24, $25,
          $26, $27, $28,
          NOW(), NOW()
        )
        ON CONFLICT (id) DO UPDATE SET
          uhid = EXCLUDED.uhid,
          "firstName" = EXCLUDED."firstName",
          "middleName" = EXCLUDED."middleName",
          "lastName" = EXCLUDED."lastName",
          salutation = EXCLUDED.salutation,
          "dateOfBirth" = EXCLUDED."dateOfBirth",
          age = EXCLUDED.age,
          gender = EXCLUDED.gender,
          "bloodGroup" = EXCLUDED."bloodGroup",
          "maritalStatus" = EXCLUDED."maritalStatus",
          mobile = EXCLUDED.mobile,
          email = EXCLUDED.email,
          "residentialAddress" = EXCLUDED."residentialAddress",
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          country = EXCLUDED.country,
          pincode = EXCLUDED.pincode,
          "emergencyName" = EXCLUDED."emergencyName",
          "emergencyPhone" = EXCLUDED."emergencyPhone",
          "emergencyRelationship" = EXCLUDED."emergencyRelationship",
          "patientCategory" = EXCLUDED."patientCategory",
          "careType" = EXCLUDED."careType",
          "assignedDepartment" = EXCLUDED."assignedDepartment",
          "isActive" = EXCLUDED."isActive",
          "updatedAt" = NOW()
      `, values)
      patientCount++
      console.log(`  ✔ ${p.uhid || p.id} — ${p.name}`)
    } catch (err) {
      console.error(`  ✘ ${p.uhid || p.id} — ${p.name}: ${err.message}`)
    }
  }
  console.log(`\nPatients: ${patientCount}/${patients.length} migrated\n`)

  // ─── Migrate JSONB tables ───
  for (const table of JSONB_TABLES) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id text PRIMARY KEY,
        payload jsonb NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    const items = db[table]
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log(`  ⏭ "${table}" — no data, skipping`)
      continue
    }

    let count = 0
    for (const item of items) {
      const id = String(item.id || item.uhid || `auto-${table}-${count}`)
      await pool.query(
        `INSERT INTO ${table} (id, payload) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
        [id, item]
      )
      count++
    }
    console.log(`  ✔ "${table}" — upserted ${count} records`)
  }

  // ─── Verification ───
  console.log('\n=== Verification ===')
  const pRes = await pool.query('SELECT count(*) as cnt FROM patients')
  console.log(`  patients: ${pRes.rows[0].cnt} rows`)
  for (const table of JSONB_TABLES) {
    try {
      const res = await pool.query(`SELECT count(*) as cnt FROM ${table}`)
      console.log(`  ${table}: ${res.rows[0].cnt} rows`)
    } catch { /* table doesn't exist */ }
  }

  // Show a few patients to confirm
  const sampleRes = await pool.query('SELECT uhid, "firstName", "lastName", mobile, "careType" FROM patients LIMIT 5')
  console.log('\nSample patients:')
  sampleRes.rows.forEach(r => console.log(`  ${r.uhid} — ${r.firstName} ${r.lastName} — ${r.mobile} — ${r.careType}`))

  console.log('\n✅ Migration complete!')
  await pool.end()
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
