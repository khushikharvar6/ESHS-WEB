const { Client } = require('pg');
const bcrypt = require('bcrypt');
const client = new Client({ connectionString: 'postgresql://postgres:root@127.0.0.1:5432/eshs?schema=public' });

client.connect().then(async () => {
  const res = await client.query('SELECT id, password FROM users');
  for (const row of res.rows) {
    if (!row.password.startsWith('$2')) {
      console.log(`Hashing password for user ${row.id}...`);
      const hash = await bcrypt.hash(row.password, 10);
      await client.query('UPDATE users SET password = $1 WHERE id = $2', [hash, row.id]);
    }
  }
  console.log('Done hashing passwords.');
  client.end();
}).catch(console.error);
