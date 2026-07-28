'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS, CURRENT_USER, isNavAllowed } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function SidebarNav({ onNavigateAction }: { onNavigateAction?: () => void }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Primary" />
  }

  const allowedItems = NAV_ITEMS.filter((item) =>
    isNavAllowed(item.title, CURRENT_USER.roleKey)
  )

  return (
    <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Primary">
      {allowedItems.map((item) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href) && (!item.subItems || item.subItems.every(sub => pathname !== sub.href))
        const Icon = item.icon
        
        return (
          <div key={item.href} className="flex flex-col gap-1">
            <Link
              href={item.href}
              onClick={item.subItems ? undefined : onNavigateAction}
              aria-current={active && !item.subItems ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                (active && !item.subItems) || (pathname === item.href && item.subItems)
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon
                className={cn(
                  'size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                  (active && !item.subItems) || (pathname === item.href && item.subItems) ? 'text-primary-foreground' : 'text-muted-foreground',
                )}
                aria-hidden="true"
              />
              <span>{item.title}</span>
            </Link>

            {item.subItems && (
              <div className="flex flex-col gap-1 pl-9 mt-1">
                {item.subItems.map(subItem => {
                  const isSubActive = pathname === subItem.href
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      onClick={onNavigateAction}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                        isSubActive
                          ? 'text-primary font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      )}
                    >
                      {subItem.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
