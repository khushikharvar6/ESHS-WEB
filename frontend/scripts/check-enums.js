const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:root@localhost:5432/eshs' });

async function main() {
  // Check enum values
  const enums = await pool.query(`
    SELECT t.typname, e.enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    ORDER BY t.typname, e.enumsortorder
  `);
  
  const grouped = {};
  enums.rows.forEach(r => {
    if (!grouped[r.typname]) grouped[r.typname] = [];
    grouped[r.typname].push(r.enumlabel);
  });
  
  Object.entries(grouped).forEach(([name, values]) => {
    console.log(`${name}: ${values.join(', ')}`);
  });

  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
