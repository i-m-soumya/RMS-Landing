import { useEffect, useState } from 'react';

export default function ReactNav({ links = [], logoUrl = '/favicon.svg', signupLabel = 'Start free for 3 months' }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`nav-shell fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'landing-nav-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-2 font-bold text-xl text-brand-text" aria-label="Restro360 home">
            <img src={logoUrl} alt="Restro360" className="h-10 w-auto max-w-none" />
          </a>

          <div className="hidden lg:flex items-center gap-5">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="desktop-nav-link text-sm transition-colors font-medium"
                type="button"
              >
                {link.label}
              </button>
            ))}
            <a href="/signup" className="h-9 whitespace-nowrap rounded-xl bg-brand-accent px-3 text-xs font-semibold text-white transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              {signupLabel}
            </a>
            <a href="#contact" className="whitespace-nowrap text-xs font-semibold text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Book a Free Demo
            </a>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg hover:bg-brand-muted transition-colors"
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div
          id="mobile-navigation-menu"
          className={menuOpen ? 'mobile-nav-open' : 'mobile-nav-closed'}
          aria-hidden={!menuOpen}
        >
          <div className="bg-white border-t border-brand-border/30 py-3 flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-left px-4 py-2.5 text-sm text-brand-text hover:bg-brand-muted rounded-lg mx-2 transition-colors"
                type="button"
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 pt-2 pb-1">
              <a href="/signup" className="w-full min-h-10 bg-brand-accent text-white text-sm font-semibold rounded-xl inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent">
                {signupLabel}
              </a>
              <a href="#contact" className="mt-2 inline-flex min-h-10 w-full items-center justify-center text-sm font-semibold text-brand-accent underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent">
                Book a Free Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
