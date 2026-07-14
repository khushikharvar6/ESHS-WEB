
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.xunvxidavtgneiozpmec:Eshealthcarecentre1234@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'
});
client.connect()
  .then(() => client.query('ALTER TABLE "patient_insurance" DROP CONSTRAINT "patient_insurance_patientUhid_fkey"'))
  .then(() => client.query('ALTER TABLE "patient_corporate" DROP CONSTRAINT "patient_corporate_patientUhid_fkey"'))
  .then(() => client.query('ALTER TABLE "patients" DROP CONSTRAINT "patients_pkey" CASCADE'))
  .then(() => console.log('Dropped constraints successfully!'))
  .catch(err => console.error(err.message))
  .finally(() => client.end());

