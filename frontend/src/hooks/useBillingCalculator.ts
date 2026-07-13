import type { BillingInvoiceItem, DiscountType, PaymentStatus } from '@/src/types/billing.types'

export function calculateBillingTotals({
  items,
  discountType,
  discountValue,
  depositAmount,
  amountReceived,
}: {
  items: BillingInvoiceItem[]
  discountType: DiscountType
  discountValue: number
  depositAmount: number
  amountReceived: number
}) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxAmount = items.reduce((sum, item) => sum + item.amount * (item.taxRate / 100), 0)
  const discountAmount =
    discountType === 'percentage' ? (subtotal * discountValue) / 100 : discountValue
  const taxableAmount = Math.max(subtotal - discountAmount, 0)
  const grandTotal = taxableAmount + taxAmount
  const dueAmount = Math.max(grandTotal - depositAmount - amountReceived, 0)
  const paymentStatus: PaymentStatus =
    dueAmount <= 0
      ? 'Paid'
      : amountReceived > 0 || depositAmount > 0
        ? 'Partially Paid'
        : 'Pending'

  return {
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    dueAmount,
    paymentStatus,
  }
}

export function buildInvoiceItem(item: {
  itemType: 'SERVICE' | 'TEST' | 'PACKAGE'
  itemName: string
  category: string
  department: string
  quantity: number
  unitPrice: number
  taxRate: number
}) {
  const amount = item.quantity * item.unitPrice

  return {
    id: `${item.itemName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    itemType: item.itemType,
    itemName: item.itemName,
    category: item.category,
    department: item.department,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    taxRate: item.taxRate,
    amount,
  }
}
