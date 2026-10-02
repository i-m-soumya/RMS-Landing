import { Check, Calendar } from 'lucide-react';
import { siteContent } from '../src/content/siteContent';

const included = siteContent.setupIncluded;

const scrollTo = (id: string) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function SetupSection() {
  return (
    <section id="setup" className="py-16 bg-brand-bg" aria-labelledby="setup-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 id="setup-heading" className="font-display text-3xl font-bold text-brand-text mb-3">{siteContent.sections.setup.heading}</h2>
          <p className="text-brand-sub max-w-md mx-auto">
            {siteContent.sections.setup.subheading}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* What You Get */}
          <div className="bg-white rounded-2xl p-6 border border-brand-border/30 shadow-card">
            <h3 className="text-lg font-bold text-brand-text mb-5">{siteContent.sections.setup.includedTitle}</h3>
            <div className="grid grid-cols-1 gap-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-brand-success/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-brand-success" strokeWidth={3} />
                  </div>
                  <p className="text-sm text-brand-text">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-brand-accent to-brand-accent-light rounded-2xl p-6 text-white flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-5">
                <Calendar size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{siteContent.sections.setup.ctaTitle}</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                {siteContent.sections.setup.ctaText}
              </p>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-white/50 rounded-full" />
                <p className="text-sm text-white/80">{siteContent.sections.setup.ctaBulletOne}</p>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-white/50 rounded-full" />
                <p className="text-sm text-white/80">{siteContent.sections.setup.ctaBulletTwo}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => scrollTo('#contact')}
                className="w-full h-12 bg-white text-brand-accent font-bold rounded-xl hover:bg-white/90 transition-all"
              >
                {siteContent.sections.setup.buttonPrimary}
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="w-full h-12 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                {siteContent.sections.setup.buttonSecondary}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
