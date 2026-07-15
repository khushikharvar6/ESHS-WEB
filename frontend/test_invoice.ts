import { prisma } from './lib/server-db'

async function main() {
  console.log('Attempting to create invoice...')
  const uhid = 'ES2026-720988' // The test patient I just created
  
  try {
    const invoice = await prisma.invoice.create({
      data: {
        uhid: uhid,
        patient: 'Khushi Kharvar',
        service: 'Pathology: CBC - Complete Blood Count',
        date: new Date().toISOString(),
        subtotal: 315,
        tax: 0,
        discount: 0,
        total: 315,
        paid: 315,
        balance: 0,
        status: 'Paid',
        paymentMode: 'Cash',
        transactionId: 'TX12345',
        remarks: 'Paid in full'
      }
    })
    console.log('Success!', invoice)
  } catch (e) {
    console.error('Error creating invoice:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
