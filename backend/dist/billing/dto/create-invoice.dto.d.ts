export declare class InvoiceItemDto {
    itemType: string;
    testId?: string;
    packageId?: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
}
export declare class CreateInvoiceDto {
    patientId: string;
    appointmentId?: string;
    items: InvoiceItemDto[];
    discountType?: string;
    discountValue?: number;
    amountPaid?: number;
    paymentMode?: string;
    transactionId?: string;
    insuranceProvider?: string;
    insurancePolicyNo?: string;
    insuranceClaimAmount?: number;
    remarks?: string;
}
export declare class RecordPaymentDto {
    amount: number;
    paymentMode: string;
    transactionId?: string;
    remarks?: string;
}
