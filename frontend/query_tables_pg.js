const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:root@127.0.0.1:5432/eshs?schema=public'
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT tablename 
    FROM pg_catalog.pg_tables 
    WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
main();
