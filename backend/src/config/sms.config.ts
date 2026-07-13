import { registerAs } from '@nestjs/config';

export default registerAs('sms', () => ({
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  esPhoneNumber: process.env.ES_PHONE_NUMBER || '+917961616161',
}));
