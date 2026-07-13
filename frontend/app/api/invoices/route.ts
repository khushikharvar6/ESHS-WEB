import { NextResponse } from 'next/server'
import {
  createResource,
  deleteResource,
  listResource,
  updateResource,
} from '@/lib/server-db'
import { sendNotification, NotificationTemplates } from '@/lib/sms'

export const runtime = 'nodejs'

export async function GET() {
  const invoices = await listResource('invoices')
  return NextResponse.json(invoices)
}

export async function POST(request: Request) {
  const payload = await request.json()
  
  // Map frontend BillingInvoice payload to Prisma Invoice schema
  const prismaInvoice = {
    uhid: payload.patient?.uhid || '',
    patient: payload.patient?.name || '',
    service: Array.isArray(payload.items) && payload.items.length > 0
      ? `${payload.items[0].department || 'Medical Services'}: ` + payload.items.map((i: any) => i.itemName || i.service || '').filter(Boolean).join(', ')
      : payload.service || '',
    date: new Date().toISOString(),
    subtotal: payload.subtotal || 0,
    tax: payload.taxAmount || 0,
    discount: payload.discountAmount || 0,
    total: payload.grandTotal || 0,
    paid: payload.amountReceived || 0,
    balance: payload.dueAmount || 0,
    status: payload.paymentStatus || 'Pending',
    paymentMode: payload.paymentMode || '',
    transactionId: payload.transactionId || '',
    remarks: [payload.bankName ? `Bank: ${payload.bankName}` : '', payload.remarks].filter(Boolean).join(' | ')
  }

  const invoice = await createResource('invoices', prismaInvoice)
  
  // Trigger mock SMS and WhatsApp notification
  if (invoice?.patient) {
    const patientName = typeof invoice.patient === 'string' ? invoice.patient : invoice.patient.name || 'Patient';
    const amount = invoice.grandTotal || invoice.total || invoice.amount || 0;
    
    // Fire and forget (don't await)
    sendNotification({
      to: 'Patient Phone', // In a real app, you would fetch patient phone from DB or payload
      message: NotificationTemplates.invoiceGenerated(patientName, invoice.invoiceNumber || invoice.id, amount),
      type: 'SMS'
    }).catch(console.error);

    sendNotification({
      to: 'Patient Phone',
      message: NotificationTemplates.invoiceGenerated(patientName, invoice.invoiceNumber || invoice.id, amount),
      type: 'WHATSAPP'
    }).catch(console.error);
  }
  
  return NextResponse.json(invoice, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, patch } = await request.json()
  const invoice = await updateResource('invoices', String(id), patch)
  return NextResponse.json(invoice)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  const result = await deleteResource('invoices', String(id))
  return NextResponse.json(result)
}
