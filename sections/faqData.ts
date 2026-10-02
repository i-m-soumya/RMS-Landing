import { siteContent } from '../src/content/siteContent';

export const faqs = siteContent.faq.map((item) => ({
  q: item.question,
  a: item.answer,
}));
