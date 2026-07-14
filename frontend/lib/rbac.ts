export type Role = 'ADMIN' | 'FRONT_DESK' | 'OPD' | 'MRD' | 'QA'

export type Module = 
  | 'DASHBOARD'
  | 'INQUIRY'
  | 'APPOINTMENT'
  | 'REGISTRATION'
  | 'PATIENT_PROFILE'
  | 'BILLING'
  | 'FEEDBACK'
  | 'MRD'
  | 'QA'
  | 'USER_MANAGEMENT'
  | 'SMS'

export type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'FULL'

export type Permissions = {
  [K in Module]?: Action[]
}

export const PERMISSION_MATRIX: Record<Role, Permissions> = {
  ADMIN: {
    DASHBOARD: ['FULL'],
    INQUIRY: ['FULL'],
    APPOINTMENT: ['FULL'],
    REGISTRATION: ['FULL'],
    PATIENT_PROFILE: ['FULL'],
    BILLING: ['FULL'],
    FEEDBACK: ['FULL'],
    MRD: ['FULL'],
    QA: ['FULL'],
    USER_MANAGEMENT: ['FULL'],
    SMS: ['FULL'],
  },
  FRONT_DESK: {
    DASHBOARD: ['FULL'],
    INQUIRY: ['FULL'],
    APPOINTMENT: ['FULL'],
    REGISTRATION: ['FULL'],
    PATIENT_PROFILE: ['FULL'],
    BILLING: ['FULL'],
    FEEDBACK: ['FULL'],
  },
  MRD: {
    DASHBOARD: ['READ'],
    PATIENT_PROFILE: ['FULL'],
    FEEDBACK: ['FULL'],
    MRD: ['FULL'],
  },
  QA: {
    DASHBOARD: ['READ'],
    PATIENT_PROFILE: ['FULL'],
    FEEDBACK: ['FULL'],
    QA: ['FULL'],
  },
  OPD: {
    DASHBOARD: ['READ'],
    PATIENT_PROFILE: ['FULL'],
    MRD: ['READ', 'UPDATE'],
    QA: ['READ', 'UPDATE'],
  },
}

export function hasPermission(role: string, module: Module, action: Action): boolean {
  if (!role) return false
  
  // ADMIN has full access, but we still check the matrix
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return true
  
  const mappedRole = role as Role
  const rolePermissions = PERMISSION_MATRIX[mappedRole]
  if (!rolePermissions) return false

  const modulePermissions = rolePermissions[module]
  if (!modulePermissions) return false

  return modulePermissions.includes('FULL') || modulePermissions.includes(action)
}

import { useEffect, useState } from 'react'

export function useRBAC() {
  const [roleKey, setRoleKey] = useState<string>('')

  useEffect(() => {
    // CURRENT_USER relies on window.localStorage, so we read it inside useEffect
    import('./constants').then((mod) => {
      setRoleKey(mod.CURRENT_USER.roleKey)
    })
  }, [])

  const can = (module: Module, action: Action) => {
    if (!roleKey) return false
    return hasPermission(roleKey, module, action)
  }

  return { can, roleKey }
}
