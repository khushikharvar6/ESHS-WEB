'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { DataProvider } from '@/lib/store'
import { USERS, NAV_ITEMS, isNavAllowed } from '@/lib/constants'
import { toast } from 'sonner'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth for public feedback routes - never redirect /f/* to login
    if (pathname.startsWith('/f/') || pathname.startsWith('/f')) return

    const isAuthenticated = typeof window !== 'undefined' && window.localStorage.getItem('es-homs-auth')
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const roleKey = window.localStorage.getItem('es-homs-role') || 'FRONT_DESK'
    const roleName = roleKey.replace('_', ' ')

    // Determine matching NavItem for active route
    const matchedNavItem = NAV_ITEMS.find((item) => {
      if (item.href === '/') {
        return pathname === '/'
      }
      return pathname.startsWith(item.href)
    })

    if (matchedNavItem && !isNavAllowed(matchedNavItem.title, roleKey)) {
      toast.error(`Access Denied`, {
        description: `Your profile (${roleName}) is not authorized to view ${matchedNavItem.title}.`,
      })
      router.push('/')
    }
  }, [pathname, router])

  return (
    <DataProvider>
      <AppShell>{children}</AppShell>
    </DataProvider>
  )
}
