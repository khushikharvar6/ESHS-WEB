export declare const APP_NAME = "ES Healthcare Centre";
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
export declare const SMS_TEMPLATES: {
    readonly UHID_REGISTRATION: (uhid: string, name: string) => string;
    readonly BILL_SHARE: (invoiceNumber: string, amount: string, link: string) => string;
    readonly APPOINTMENT_REMINDER: (name: string, date: string, time: string, doctor: string) => string;
    readonly FEEDBACK_LINK: (name: string, link: string) => string;
};
