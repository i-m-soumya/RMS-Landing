export const pricingConfig = {
  INTRO_PRICE_INR: 2,
  INTRO_MONTHS: 3,
  STANDARD_PRICE_INR: 599,
  GST_TEXT: 'GST as applicable',
  CANCEL_ANYTIME: 'Cancel anytime',
  MARKETING_COPY: 'First 3 months at just Rs 2/month, then Rs 599/month. Cancel anytime.',
  SUPPORT_EMAIL: import.meta.env.PUBLIC_SUPPORT_EMAIL || 'support@restro360.tech',
  SALES_PHONE: (import.meta.env.PUBLIC_SALES_PHONE || '').trim(),
  SOCIAL_LINKS: {
    x: (import.meta.env.PUBLIC_X_URL || '').trim(),
    linkedin: (import.meta.env.PUBLIC_LINKEDIN_URL || '').trim(),
    instagram: (import.meta.env.PUBLIC_INSTAGRAM_URL || '').trim(),
    facebook: (import.meta.env.PUBLIC_FACEBOOK_URL || '').trim(),
  },
};

export const siteConfig = {
  domain: 'https://restro360.tech/',
  canonicalUrl: 'https://restro360.tech/',
  siteName: 'Restro360',
  supportEmail: pricingConfig.SUPPORT_EMAIL,
  phone: pricingConfig.SALES_PHONE,
  socialLinks: pricingConfig.SOCIAL_LINKS,
};
