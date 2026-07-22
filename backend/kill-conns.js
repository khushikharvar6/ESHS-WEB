const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ 
  datasources: { 
    db: { 
      url: 'postgresql://postgres.xunvxidavtgneiozpmec:Eshealthcarecentre1234@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres' 
    } 
  } 
});

async function run() {
  try {
    const res = await prisma.$executeRawUnsafe(`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND usename = 'postgres'`);
    console.log('Killed connections:', res);
  } catch(e) {
    console.log('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
