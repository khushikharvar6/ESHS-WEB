const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.xunvxidavtgneiozpmec:Eshealthcarecentre1234@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'
});
client.connect()
  .then(() => client.query(`INSERT INTO "users" ("id", "email", "password", "first_name", "last_name", "role", "is_active", "updated_at") VALUES ('ADM001', 'admin@eshs.in', 'Admin@123', 'Khushi', 'Kharvar', 'ADMIN', true, NOW())`))
  .then(() => console.log('Admin user inserted successfully!'))
  .catch(err => console.error(err.message))
  .finally(() => client.end());
