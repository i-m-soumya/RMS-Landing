// Shared marketing and product config for the landing site. Keep pricing and feature
// switches in this file so the landing page, signup flow, and payment page stay aligned.
const trialMonths = 3;
const standardPriceInr = 599;
const gstText = 'GST as applicable';
const cancelAnyTime = 'Cancel anytime';

export const pricingConfig = {
  trialMonths,
  trialPriceInr: 0,
  standardPriceInr,
  otpResendSeconds: 30,
  gstText,
  cancelAnyTime,
  primaryCta: `Start free for ${trialMonths} months`,
  marketingCopy: `First ${trialMonths} months free, then Rs ${standardPriceInr}/month. ${cancelAnyTime}.`,
  paymentCopy: 'Rs 0 today',
  supportEmail: 'support@restro360.tech',
  salesPhone: '',
  socialLinks: {
    x: '',
    linkedin: '',
    instagram: '',
    facebook: '',
  },
  apiBaseUrl: 'https://api.restro360.tech',
  consoleUrl: 'https://console.restro360.tech',
  policyVersion: '2026-10',
};

export const siteConfig = {
  domain: 'https://restro360.tech/',
  canonicalUrl: 'https://restro360.tech/',
  siteName: 'Restro360',
  supportEmail: pricingConfig.supportEmail,
  phone: pricingConfig.salesPhone,
  socialLinks: pricingConfig.socialLinks,
  apiBaseUrl: pricingConfig.apiBaseUrl,
  consoleUrl: pricingConfig.consoleUrl,
  policyVersion: pricingConfig.policyVersion,
  pricing: pricingConfig,
};
