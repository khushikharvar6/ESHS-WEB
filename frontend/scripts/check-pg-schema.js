const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres:root@localhost:5432/eshs' });

async function main() {
  // Check all table schemas
  const tables = ['patients', 'appointments', 'inquiries', 'invoices', 'documents', 'consultations', 'ncs'];
  for (const table of tables) {
    const res = await pool.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position",
      [table]
    );
    if (res.rows.length > 0) {
      console.log(`\n=== ${table} ===`);
      res.rows.forEach(row => console.log(`  ${row.column_name} (${row.data_type})`));
      
      const countRes = await pool.query(`SELECT count(*) as cnt FROM ${table}`);
      console.log(`  -> ${countRes.rows[0].cnt} rows`);
    } else {
      console.log(`\n=== ${table} === (does not exist)`);
    }
  }
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
