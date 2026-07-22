const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.xunvxidavtgneiozpmec:Eshealthcarecentre1234@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'
});

async function killConns() {
  try {
    await client.connect();
    console.log('Connected directly to PG');
    const res = await client.query(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND usename = current_user`);
    console.log('Killed connections:', res.rowCount);
  } catch (err) {
    console.error('Failed to kill conns:', err.message);
  } finally {
    await client.end();
  }
}

killConns();
