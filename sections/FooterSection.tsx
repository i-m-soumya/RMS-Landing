import { siteContent } from '../src/content/siteContent';

const appName = siteContent.seo.siteName;

const scrollTo = (id: string) => {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
};

export default function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-text text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/src/assets/restro360_logo.svg" alt="Restro360" className="h-10 w-auto max-w-none" />
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-4">{siteContent.footer.description}</p>
            {/* Social placeholders */}
            <div className="flex gap-2">
              {['𝕏', 'in', 'f', 'ig'].map((s) => (
                <a key={s} href="#" className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-xs text-white/50 hover:bg-white/20 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Product</p>
            <div className="space-y-2">
              {siteContent.footer.productLinks.map((link) => (
                <button key={link} onClick={() => scrollTo('#features')} className="block text-sm text-white/60 hover:text-white transition-colors text-left">
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Company</p>
            <div className="space-y-2">
              {siteContent.footer.companyLinks.map((link) => (
                <button key={link} onClick={() => scrollTo('#contact')} className="block text-sm text-white/60 hover:text-white transition-colors text-left">
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Legal</p>
            <div className="space-y-2">
              {siteContent.footer.legalLinks.map((link, index) => (
                index < 2 ? (
                  <a key={link} href={siteContent.footer.legalUrls[index]} className="block text-sm text-white/60 hover:text-white transition-colors">{link}</a>
                ) : (
                  <button key={link} onClick={() => scrollTo('#contact')} className="block text-sm text-white/60 hover:text-white transition-colors text-left">{link}</button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            {siteContent.footer.copyright}
          </p>
          <p className="text-xs text-white/30">
            {siteContent.footer.subcopy}
          </p>
        </div>
      </div>
    </footer>
  );
}
