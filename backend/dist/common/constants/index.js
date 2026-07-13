"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMS_TEMPLATES = exports.MAX_PAGE_SIZE = exports.DEFAULT_PAGE_SIZE = exports.APP_NAME = void 0;
exports.APP_NAME = 'ES Healthcare Centre';
exports.DEFAULT_PAGE_SIZE = 20;
exports.MAX_PAGE_SIZE = 100;
exports.SMS_TEMPLATES = {
    UHID_REGISTRATION: (uhid, name) => `Dear ${name}, welcome to ES Healthcare Centre! Your UHID is ${uhid}. Please save this for future visits. Contact: +91 79616 16161`,
    BILL_SHARE: (invoiceNumber, amount, link) => `ES Healthcare Centre — Invoice ${invoiceNumber}, Amount: ₹${amount}. View bill: ${link}`,
    APPOINTMENT_REMINDER: (name, date, time, doctor) => `Dear ${name}, reminder: Appointment with ${doctor} on ${date} at ${time}. ES Healthcare Centre. Contact: +91 79616 16161`,
    FEEDBACK_LINK: (name, link) => `Dear ${name}, thank you for visiting ES Healthcare Centre. Please share your feedback: ${link}`,
};
//# sourceMappingURL=index.js.map