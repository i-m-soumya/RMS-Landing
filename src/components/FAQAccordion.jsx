import { useState } from 'react';

export default function FAQAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-2">
      {faqs.map((item, i) => {
        const faq = { q: item.question, a: item.answer };
        const isOpen = openIndex === i;
        return (
          <div key={faq.q} className="bg-white rounded-2xl overflow-hidden border border-brand-border/30 shadow-card">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-brand-muted/30 transition-colors"
            >
              <p className={`text-sm font-semibold pr-4 ${isOpen ? 'text-brand-accent' : 'text-brand-text'}`}>{faq.q}</p>
              <span className={`text-brand-sub shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`}>⌄</span>
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
  );
}
