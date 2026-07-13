import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

export interface InvoiceCalculation {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountDue: number;
}

@Injectable()
export class InvoiceCalculatorService {
  calculate(
    items: Array<{ unitPrice: number; quantity: number; taxRate?: number }>,
    discountType?: string,
    discountValue?: number,
    amountPaid?: number,
  ): InvoiceCalculation {
    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    // Calculate discount
    let discountAmount = 0;
    if (discountType === 'PERCENTAGE' && discountValue) {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (discountType === 'FLAT' && discountValue) {
      discountAmount = discountValue;
    }

    const afterDiscount = subtotal - discountAmount;

    // Calculate tax
    const taxAmount = items.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const itemTax = (itemTotal * (item.taxRate || 0)) / 100;
      return sum + itemTax;
    }, 0);

    const totalAmount = afterDiscount + taxAmount;
    const paid = amountPaid || 0;
    const amountDue = Math.max(0, totalAmount - paid);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      amountDue: Math.round(amountDue * 100) / 100,
    };
  }
}
