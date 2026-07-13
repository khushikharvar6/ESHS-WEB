export const APP_NAME = 'ES Healthcare Centre';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const SMS_TEMPLATES = {
  UHID_REGISTRATION: (uhid: string, name: string) =>
    `Dear ${name}, welcome to ES Healthcare Centre! Your UHID is ${uhid}. Please save this for future visits. Contact: +91 79616 16161`,

  BILL_SHARE: (invoiceNumber: string, amount: string, link: string) =>
    `ES Healthcare Centre — Invoice ${invoiceNumber}, Amount: ₹${amount}. View bill: ${link}`,

  APPOINTMENT_REMINDER: (
    name: string,
    date: string,
    time: string,
    doctor: string,
  ) =>
    `Dear ${name}, reminder: Appointment with ${doctor} on ${date} at ${time}. ES Healthcare Centre. Contact: +91 79616 16161`,

  FEEDBACK_LINK: (name: string, link: string) =>
    `Dear ${name}, thank you for visiting ES Healthcare Centre. Please share your feedback: ${link}`,
} as const;
