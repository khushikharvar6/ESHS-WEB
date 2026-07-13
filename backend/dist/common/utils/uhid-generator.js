"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUhid = generateUhid;
function generateUhid(sequenceNumber) {
    const year = new Date().getFullYear();
    const padded = String(sequenceNumber).padStart(5, '0');
    return `ESHS${year}-${padded}`;
}
//# sourceMappingURL=uhid-generator.js.map