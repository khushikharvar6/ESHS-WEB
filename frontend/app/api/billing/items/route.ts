import { NextResponse } from 'next/server'
import { listResource } from '@/lib/server-db'
import { ESHEALTH_TEST_MASTER } from '@/src/config/testMaster'
import { SERVICE_MASTER } from '@/src/config/serviceMaster'
import { PACKAGE_MASTER } from '@/src/config/packageMaster'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [tests, services, packages] = await Promise.all([
      listResource('test_masters'),
      listResource('service_masters'),
      listResource('package_masters'),
    ])

    return NextResponse.json({
      tests: tests.length > 0 ? tests : ESHEALTH_TEST_MASTER,
      services: services.length > 0 ? services : SERVICE_MASTER,
      packages: packages.length > 0 ? packages : PACKAGE_MASTER,
    })
  } catch (error) {
    console.error('Failed to load items from DB, falling back to static config:', error)
    return NextResponse.json({
      tests: ESHEALTH_TEST_MASTER,
      services: SERVICE_MASTER,
      packages: PACKAGE_MASTER,
    })
  }
}
