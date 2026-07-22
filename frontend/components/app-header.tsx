'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Menu,
  Search,
  Plus,
  Bell,
  UserPlus,
  PhoneCall,
  Receipt,
  CalendarDays,
  MessageSquare,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@/components/ui/input-group'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { LiveClock } from '@/components/live-clock'
import { CURRENT_USER, type NavItem } from '@/lib/constants'
import { useHealthcare } from '@/lib/store'

type NotificationItem = {
  id: string
  title: string
  module: string
  detail: string
  time: string
  href: string
}

const quickActions = [
  { label: 'Quick Inquiry', icon: PhoneCall, href: '/inquiry?new=1' },
  { label: 'Quick Appointment', icon: CalendarDays, href: '/appointment?new=1' },
  { label: 'Quick Registration', icon: UserPlus, href: '/registration' },
  { label: 'Quick Billing', icon: Receipt, href: '/billing?new=1' },
  { label: 'Quick Feedback', icon: MessageSquare, href: '/feedback?pick=1' },
]

export function AppHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const router = useRouter()
  const store = useHealthcare()
  
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !store) return []
    const query = searchQuery.toLowerCase()
    const results: { type: string; title: string; subtitle: string; href: string }[] = []

    // 1. Search patients
    store.patients.forEach(p => {
      const name = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase()
      const uhid = (p.uhid || '').toLowerCase()
      const phone = (p.phone || '').toLowerCase()
      if (name.includes(query) || uhid.includes(query) || phone.includes(query)) {
        results.push({
          type: 'Patient',
          title: `${p.firstName} ${p.lastName}`,
          subtitle: `UHID: ${p.uhid} | Phone: ${p.phone || 'N/A'}`,
          href: `/patient-profile?uhid=${p.uhid}`
        })
      }
    })

    return results.slice(0, 10)
  }, [searchQuery, store])

  useEffect(() => {
    setMounted(true)
  }, [])

  const notifItems = useMemo(() => {
    if (!mounted || !store) return []
    
    const items: NotificationItem[] = []
    
    // 1. Pending NCs
    store.ncs.filter(nc => nc.status !== 'Closed').forEach(nc => {
      items.push({
        id: `nc-${nc.id}`,
        title: nc.title || `Non-Conformance: ${nc.id}`,
        module: 'Compliance',
        detail: `Severity: ${nc.severity} | Dept: ${nc.department}`,
        time: 'Pending',
        href: `/compliance`
      })
    })

    // 2. Pending Inquiries
    store.inquiries.filter(i => i.status === 'New').forEach(i => {
      items.push({
        id: `inq-${i.id}`,
        title: `New Inquiry`,
        module: 'Front Desk',
        detail: `${i.firstName} ${i.lastName} - ${i.service}`,
        time: 'Pending',
        href: `/inquiry`
      })
    })

    // 3. Appointments (Active)
    store.appointments.filter(a => a.status === 'Scheduled' || a.status === 'Checked In').forEach(a => {
      items.push({
        id: `apt-${a.id}`,
        title: `Appointment ${a.status}`,
        module: 'OPD',
        detail: `${a.firstName} ${a.lastName} with ${a.doctor}`,
        time: a.time,
        href: `/appointment`
      })
    })

    // 4. Pending Invoices
    store.invoices.filter(i => i.status === 'Draft' || i.status === 'Pending').forEach(i => {
      items.push({
        id: `inv-${i.id}`,
        title: `Unpaid Invoice ${i.id}`,
        module: 'Billing',
        detail: `Patient: ${i.patient} | Balance: ${i.balance}`,
        time: 'Pending',
        href: `/billing`
      })
    })

    // 5. Newly Registered Patients (Today)
    const today = new Date().toISOString().split('T')[0]
    store.patients.filter(p => p.createdAt && p.createdAt.startsWith(today)).forEach(p => {
      items.push({
        id: `pat-${p.uhid}`,
        title: `New Patient Registered`,
        module: 'Registration',
        detail: `${p.name} (${p.uhid})`,
        time: 'Today',
        href: `/patient-profile?uhid=${p.uhid}`
      })
    })

    // Filter out dismissed
    return items.filter(item => !dismissedIds.has(item.id))
  }, [mounted, store, dismissedIds])

  function handleProfileAction(path: string) {
    router.push(path)
    toast.success('Opened profile workspace')
  }

  async function handleSignOut() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      // Ignore errors if the network is down
    }
    
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('es-homs-auth')
      window.localStorage.removeItem('es-homs-user')
      window.localStorage.removeItem('es-homs-role')
      window.localStorage.removeItem('es-homs-name')
    }
    toast.success('Signed out')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur sm:px-4 lg:gap-3 print:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenSidebar}
        aria-label="Open navigation menu"
      >
        <Menu />
      </Button>

      <div className="w-full max-w-md relative">
        <InputGroup>
          <InputGroupAddon>
            <Search className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search patient name, UHID, or phone..."
            aria-label="Global search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsSearchOpen(true)
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          />
        </InputGroup>

        {isSearchOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>
            ) : (
              <div className="flex flex-col">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    className="flex flex-col text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                    onClick={() => {
                      setSearchQuery('')
                      setIsSearchOpen(false)
                      router.push(r.href)
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{r.type}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{r.title}</span>
                    <span className="text-xs text-slate-500">{r.subtitle}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="hidden sm:flex" />
            }
          >
            <Plus data-icon="inline-start" />
            Quick Actions
            <ChevronDown data-icon="inline-end" className="opacity-60" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <DropdownMenuItem
                    key={action.label}
                    onClick={() => router.push(action.href)}
                  >
                    <Icon />
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <LiveClock />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Notifications, ${notifItems.length} unread`}
              />
            }
          >
            <Bell />
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-background">
              {notifItems.length}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifItems.map((n: NotificationItem) => (
                <DropdownMenuItem
                  key={n.id}
                  className="flex flex-col items-start gap-0.5 py-2"
                  onClick={() => {
                    setDismissedIds((prev) => {
                      const next = new Set(prev)
                      next.add(n.id)
                      return next
                    })
                    router.push(n.href)
                  }}
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {n.title}
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      {n.module}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {n.detail}
                  </span>
                  <span className="text-[11px] text-muted-foreground/70">
                    {n.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="hidden h-8 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-11 gap-2 px-1.5 sm:px-2" />
            }
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {mounted ? CURRENT_USER.initials : '..'}
              </AvatarFallback>
            </Avatar>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-medium text-foreground">
                {mounted ? CURRENT_USER.name : 'Loading...'}
              </span>
              <span className="text-xs text-muted-foreground">
                {mounted ? CURRENT_USER.role : '...'}
              </span>
            </span>
            <ChevronDown
              data-icon="inline-end"
              className="hidden opacity-60 sm:block"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                  {mounted ? CURRENT_USER.name : 'Loading...'}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {mounted ? CURRENT_USER.role : '...'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleSignOut}
            >
              <LogOut />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export type { NavItem }
