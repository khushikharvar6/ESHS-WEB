const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.xunvxidavtgneiozpmec:Eshealthcarecentre1234@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true', ssl: { rejectUnauthorized: false } });

async function check() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
    console.log('Tables:', res.rows.map(r => r.table_name));
    
    if (res.rows.find(r => r.table_name === 'patients')) {
      const p = await pool.query('SELECT count(*) FROM patients');
      console.log('patients count:', p.rows[0].count);
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
check();
