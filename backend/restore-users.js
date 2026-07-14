
const { Client } = require('pg');
const fs = require('fs');
const client = new Client({
  connectionString: 'postgresql://postgres.xunvxidavtgneiozpmec:Eshealthcarecentre1234@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function main() {
  await client.connect();
  const data = JSON.parse(fs.readFileSync('db-export.json', 'utf8'));
  for (const u of data.users) {
    if (u.email === 'admin@eshs.in') continue; // already inserted
    try {
      await client.query(
        'INSERT INTO "users" ("id", "email", "password", "first_name", "last_name", "role", "is_active", "updated_at") VALUES (, , , , , , , NOW())',
        [u.id, u.email, u.password, u.first_name, u.last_name, 'FRONT_DESK', u.is_active]
      );
      console.log('Inserted:', u.email);
    } catch(e) {
      console.error('Failed to insert', u.email, e.message);
    }
  }
  await client.end();
}
main();

