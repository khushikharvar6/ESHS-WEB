'use client'

import { useRBAC, type Module, type Action } from '@/lib/rbac'

export function Protect({
  module,
  action,
  children,
  fallback = null,
}: {
  module: Module
  action: Action
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { can, roleKey } = useRBAC()

  // During initial mount, roleKey might be empty (if reading from localStorage asynchronously)
  // Let's render null until roleKey is resolved, or default to checking it.
  if (!roleKey) return null

  if (!can(module, action)) return <>{fallback}</>
  return <>{children}</>
}
