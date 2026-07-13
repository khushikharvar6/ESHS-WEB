export interface InvoiceCalculation {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    amountDue: number;
}
export declare class InvoiceCalculatorService {
    calculate(items: Array<{
        unitPrice: number;
        quantity: number;
        taxRate?: number;
    }>, discountType?: string, discountValue?: number, amountPaid?: number): InvoiceCalculation;
}
