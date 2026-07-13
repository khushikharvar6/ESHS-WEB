export interface SMSPayload {
  to: string;
  message: string;
  type: 'SMS' | 'WHATSAPP';
}

export const sendNotification = async (payload: SMSPayload): Promise<boolean> => {
  // In a real application, this would call an API like Twilio, Gupshup, or a local SMS gateway.
  // For now, we simulate the network request and log it.
  
  console.log(`[AUTOMATION] Sending ${payload.type} to ${payload.to}...`);
  console.log(`[AUTOMATION] Message Content:\n${payload.message}`);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[AUTOMATION] Successfully delivered ${payload.type} to ${payload.to}.`);
      resolve(true);
    }, 1000);
  });
};

export const generateWhatsAppLink = (phone: string, message: string) => {
  // Remove any non-numeric characters from the phone number
  const cleanPhone = phone.replace(/\D/g, '');
  // If it's a 10 digit Indian number, prefix with 91
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
};

export const NotificationTemplates = {
  appointmentCreated: (name: string, date: string, time: string, doctor: string, salutation: string = '') => 
    `Hello ${salutation ? salutation + ' ' : ''}${name}, Your appointment with ${doctor} is confirmed for ${date} at ${time}. Thank you for choosing ES Healthcare Centre.\n\nIf you need any assistance or have any problems, please call us on: +917961616161`,
  
  patientRegistered: (name: string, uhid: string, salutation: string = '') => 
    `Hello ${salutation ? salutation + ' ' : ''}${name}, Thank you for registering with ES Healthcare Centre! Your unique health ID (UHID) is ${uhid}. We're here to support your healthcare journey.\n\nIf you need any assistance or have any problems, please call us on: +917961616161`,
    
  invoiceGenerated: (name: string, invoiceNo: string, amount: number, salutation: string = '') =>
    `Hello ${salutation ? salutation + ' ' : ''}${name}, Your bill is now available for viewing. Please check the attached file to review your billing details. Thank you for trusting ES Healthcare Centre for your care.\n\nIf you need any assistance or have any problems, please call us on: +917961616161`,
};
