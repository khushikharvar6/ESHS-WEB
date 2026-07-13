import { listResource, deleteResource, DbResource } from './lib/server-db'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function clear() {
  const resources: DbResource[] = ['consultations', 'documents', 'ncs', 'invoices', 'appointments', 'inquiries', 'patients']
  for (const r of resources) {
    try {
      const items = await listResource(r)
      for (const item of items) {
        await deleteResource(r, item.id)
      }
      console.log(`Cleared ${r}`)
    } catch (e) {
      console.error(`Error clearing ${r}`, e)
    }
  }
  process.exit(0)
}

clear()
