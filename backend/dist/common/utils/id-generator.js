"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ID_PREFIXES = void 0;
exports.generateSequentialId = generateSequentialId;
function generateSequentialId(prefix, sequenceNumber) {
    const year = new Date().getFullYear();
    const padded = String(sequenceNumber).padStart(5, '0');
    return `${prefix}-${year}-${padded}`;
}
exports.ID_PREFIXES = {
    INVOICE: 'INV',
    APPOINTMENT: 'APT',
    INQUIRY: 'INQ',
    NON_CONFORMANCE: 'NC',
};
//# sourceMappingURL=id-generator.js.map