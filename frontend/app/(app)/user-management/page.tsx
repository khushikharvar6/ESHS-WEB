'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/page-header'
import { Protect } from '@/components/protect'
import { DataTable, type Column } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { AddUserDialog } from '@/components/users/AddUserDialog'
import { EditUserDialog } from '@/components/users/EditUserDialog'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  department?: string
  phone?: string
  isActive: boolean
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users?limit=100')
      const data = await res.json()
      if (data.success) {
        setUsers(data.users || [])
      } else {
        toast.error(data.error || 'Failed to fetch users')
      }
    } catch (err) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this user?')) return

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: false }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('User deactivated successfully')
        fetchUsers()
      } else {
        toast.error(data.error || 'Failed to deactivate user')
      }
    } catch (err) {
      toast.error('Failed to deactivate user')
    }
  }

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (u) => (
        <span className="font-medium text-foreground">{u.firstName} {u.lastName}</span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      render: (u) => <span className="text-muted-foreground">{u.email}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-1.5">
          <Shield className="size-3.5 text-muted-foreground" />
          <Badge variant="outline">{u.role}</Badge>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (u) => (
        <Badge
          variant={u.isActive ? 'default' : 'secondary'}
          className={u.isActive ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          {u.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (u) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setSelectedUser(u)
              setEditDialogOpen(true)
            }}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => handleDelete(u.id)}
            disabled={!u.isActive}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Protect module="USER_MANAGEMENT" action="FULL">
      <div className="flex flex-col gap-6">
        <PageHeader
          breadcrumb={['Home', 'User Management']}
          title="User Management"
          description="Manage staff accounts, assign roles, and control access to modules."
          action={
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus data-icon="inline-start" />
              Add User
            </Button>
          }
        />

        <div className="rounded-xl border border-border bg-card shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading users...</div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              searchKeys={['firstName', 'lastName', 'email', 'role']}
              searchPlaceholder="Search users by name, email, or role..."
              getRowKey={(row) => row.id}
              pageSize={10}
            />
          )}
        </div>
      </div>

      <AddUserDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchUsers}
      />

      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchUsers}
      />
    </Protect>
  )
}
