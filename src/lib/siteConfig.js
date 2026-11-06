import {
  CONTACT_EMAIL,
  RESTAURANT_CONSOLE_URL,
  SIGNUP_URL,
  WAITER_APP_URL,
} from '../config';

const trialMonths = 3;
const standardPriceInr = 599;

export const pricingConfig = {
  trialMonths,
  trialPriceInr: 0,
  standardPriceInr,
  otpResendSeconds: 30,
  primaryCta: `Start free for ${trialMonths} months`,
  marketingCopy: `Free for the first ${trialMonths} months, then ₹${standardPriceInr}/month.`,
  paymentCopy: '₹0 today',
  supportEmail: CONTACT_EMAIL,
  salesPhone: '8900264577',
  signupUrl: SIGNUP_URL,
  socialLinks: {
    x: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    youtube: '',
  },
  apiBaseUrl: 'https://api.restro360.tech',
  consoleUrl: RESTAURANT_CONSOLE_URL,
  appUrl: WAITER_APP_URL,
  policyVersion: '2026-10',
};

export const siteConfig = {
  domain: 'https://restro360.tech/',
  canonicalUrl: 'https://restro360.tech/',
  siteName: 'Restro360',
  supportEmail: CONTACT_EMAIL,
  phone: pricingConfig.salesPhone,
  signupUrl: SIGNUP_URL,
  socialLinks: pricingConfig.socialLinks,
  apiBaseUrl: pricingConfig.apiBaseUrl,
  consoleUrl: pricingConfig.consoleUrl,
  appUrl: pricingConfig.appUrl,
  policyVersion: pricingConfig.policyVersion,
  pricing: pricingConfig,
};
