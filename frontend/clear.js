const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:root@127.0.0.1:6543/eshs?schema=public'
});

async function clearDB() {
  await client.connect();
  console.log("Connected to DB.");

  try {
    const res = await client.query(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public';`);
    const allTables = res.rows.map(r => r.tablename);

    // Ignore users, masters, etc.
    const keep = ['users', 'service_masters', 'test_masters', 'package_masters', 'PackageItem', 'Doctor', '_prisma_migrations'];
    const toClear = allTables.filter(t => !keep.includes(t));

    for (let table of toClear) {
      console.log(`Truncating "${table}"...`);
      await client.query(`TRUNCATE TABLE "${table}" CASCADE;`);
    }

    console.log("✅ All testing data cleared successfully!");
  } catch (err) {
    console.error("Error clearing DB:", err);
  } finally {
    await client.end();
  }
}

clearDB();
