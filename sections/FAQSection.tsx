import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from './faqData';
import { siteContent } from '../src/content/siteContent';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 bg-brand-bg" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 id="faq-heading" className="font-display text-3xl font-bold text-brand-text mb-3">{siteContent.sections.faq.heading}</h2>
          <p className="text-brand-sub">{siteContent.sections.faq.subheading}</p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-brand-border/30 shadow-card">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-brand-muted/30 transition-colors"
                >
                  <p className={`text-sm font-semibold pr-4 ${isOpen ? 'text-brand-accent' : 'text-brand-text'}`}>{faq.q}</p>
                  <ChevronDown size={18} className={`text-brand-sub shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} />
                </button>
                <div className="faq-answer" style={{ maxHeight: isOpen ? '400px' : '0px' }}>
                  <div className="px-5 pb-4 border-t border-brand-border/30">
                    <p className="text-sm text-brand-sub leading-relaxed pt-3">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
