const { Client } = require('pg');

const client = new Client({ connectionString: 'postgresql://postgres:root@127.0.0.1:5432/eshs?schema=public' });

const updates = [
  { email: 'harsh.malviya@eshs.in', role: 'OPD' },
  { email: 'hemant.chouhan@eshs.in', role: 'OPD' },
  { email: 'devanshi.kharvar@eshs.in', role: 'MRD' },
  { email: 'aditi.jariwala@eshs.in', role: 'QA' },
  { email: 'admin@eshs.in', role: 'ADMIN' },
  { email: 'priyank.mohadikar@eshs.in', role: 'FRONT_DESK' },
  { email: 'hiral.monpara@eshs.in', role: 'FRONT_DESK' }
];

client.connect().then(async () => {
  for (const update of updates) {
    console.log(`Updating ${update.email} to ${update.role}`);
    await client.query('UPDATE users SET role = $1 WHERE email = $2', [update.role, update.email]);
  }
  console.log('Done updating roles.');
  client.end();
}).catch(console.error);
