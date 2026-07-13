'use client'

import {
  MessageSquare,
  Phone,
  Download,
  MapPin,
  UserRound,
  ClipboardList,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

type ActionKind =
  | 'sms'
  | 'whatsapp'
  | 'call'
  | 'download'
  | 'directions'
  | 'profile'
  | 'feedback'

const WhatsAppIcon = MessageSquare

/**
 * Reusable message preview card shown after registration or billing,
 * with real backend dispatch simulation (email + whatsapp integration).
 */
export function MessagePreview({
  message,
  actions = ['sms', 'whatsapp', 'call'],
  patientPhone,
  patientEmail,
  onProfile,
  onFeedback,
  onDownload,
}: {
  message: string
  actions?: ActionKind[]
  patientPhone?: string
  patientEmail?: string
  onProfile?: () => void
  onFeedback?: () => void
  onDownload?: () => void
}) {
  async function fire(kind: ActionKind) {
    const emailRecipient = patientEmail || 'No Email Provided'
    const phoneRecipient = patientPhone || 'No Phone Provided'

    if (kind === 'whatsapp') {
      const cleanPhone = phoneRecipient.replace(/\D/g, '')
      const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
      // Use wa.me to provide the unified landing page (supports both Web and Desktop App)
      window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, '_blank')
      toast.success('Opening WhatsApp Web...')
      return
    }

    if (kind === 'sms') {
      try {
        const response = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            email: emailRecipient,
            phone: phoneRecipient,
            type: kind,
          }),
        })
        const result = await response.json()
        if (result.success) {
          toast.success(`SMS Shared! Sent successfully to ${phoneRecipient}`)
        } else {
          toast.error(`Failed to share ${kind}`)
        }
      } catch (err) {
        toast.error(`Network error sharing ${kind}`)
      }
      return
    }

    switch (kind) {
      case 'call':
        toast(`Calling patient: ${phoneRecipient}...`)
        break
      case 'download':
        if (onDownload) {
          onDownload()
        } else {
          toast.success('Invoice downloaded successfully')
        }
        break
      case 'directions':
        toast('Opening directions to ES Healthcare Centre')
        break
      case 'profile':
        onProfile?.()
        break
      case 'feedback':
        onFeedback?.()
        break
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <p className="text-sm leading-relaxed text-foreground text-pretty font-mono bg-white p-2 border rounded">
          {message}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.includes('sms') && (
          <Button variant="outline" onClick={() => fire('sms')}>
            <MessageSquare data-icon="inline-start" />
            Send SMS
          </Button>
        )}
        {actions.includes('whatsapp') && (
          <Button variant="outline" onClick={() => fire('whatsapp')}>
            <WhatsAppIcon data-icon="inline-start" />
            Send WhatsApp
          </Button>
        )}
        {actions.includes('call') && (
          <Button variant="outline" onClick={() => fire('call')}>
            <Phone data-icon="inline-start" />
            Call Patient
          </Button>
        )}
        {actions.includes('download') && (
          <Button variant="outline" onClick={() => fire('download')}>
            <Download data-icon="inline-start" />
            Download Invoice
          </Button>
        )}
        {actions.includes('directions') && (
          <Button variant="outline" onClick={() => fire('directions')}>
            <MapPin data-icon="inline-start" />
            Visit Us
          </Button>
        )}
        {actions.includes('feedback') && (
          <Button
            variant="outline"
            onClick={() => fire('feedback')}
            className={actions.includes('profile') ? '' : 'col-span-2'}
          >
            <ClipboardList data-icon="inline-start" />
            Proceed to Feedback
          </Button>
        )}
        {actions.includes('profile') && (
          <Button onClick={() => fire('profile')} className="col-span-2">
            <UserRound data-icon="inline-start" />
            Open Patient Profile
          </Button>
        )}
      </div>
    </div>
  )
}
