'use client'

import { type FormEvent, useState } from 'react'
// @ts-ignore
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

// @ts-ignore
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error('Enter your email and password to continue.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password')
      }

      if (typeof window !== 'undefined') {
        const accessToken = data.accessToken || 'true'
        window.localStorage.setItem('es-homs-auth', accessToken)
        const userPayload = data.user;
        window.localStorage.setItem('es-homs-user', userPayload?.email || email.trim())
        window.localStorage.setItem('es-homs-role', userPayload?.role || '')
        window.localStorage.setItem('es-homs-name', userPayload?.firstName ? `${userPayload.firstName} ${userPayload.lastName || ''}`.trim() : userPayload?.email || email.trim())
      }

      toast.success('Signed in successfully')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white shadow-md">
            <Image
              src="/es-logo.jpg"
              alt="ES Healthcare Centre logo"
              width={80}
              height={80}
              className="size-[72px] object-contain"
              priority
            />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
            ES Healthcare Centre
          </h1>

        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email or Username</Label>
                <Input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email or username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                <Lock className="mr-2 size-4" />
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
