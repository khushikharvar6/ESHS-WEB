const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres:root@127.0.0.1:5432/eshs?schema=public' });
client.connect().then(() => {
  return client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
    ALTER TABLE test_masters ADD COLUMN IF NOT EXISTS "itemType" TEXT DEFAULT 'TEST';
  `);
}).then(() => {
  console.log('success');
  client.end();
}).catch(console.error);
