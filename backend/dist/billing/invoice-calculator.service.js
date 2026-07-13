"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceCalculatorService = void 0;
const common_1 = require("@nestjs/common");
let InvoiceCalculatorService = class InvoiceCalculatorService {
    calculate(items, discountType, discountValue, amountPaid) {
        const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        let discountAmount = 0;
        if (discountType === 'PERCENTAGE' && discountValue) {
            discountAmount = (subtotal * discountValue) / 100;
        }
        else if (discountType === 'FLAT' && discountValue) {
            discountAmount = discountValue;
        }
        const afterDiscount = subtotal - discountAmount;
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
};
exports.InvoiceCalculatorService = InvoiceCalculatorService;
exports.InvoiceCalculatorService = InvoiceCalculatorService = __decorate([
    (0, common_1.Injectable)()
], InvoiceCalculatorService);
//# sourceMappingURL=invoice-calculator.service.js.map