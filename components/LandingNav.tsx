import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const appName = 'Restro360';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Setup', href: '#setup' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'landing-nav-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 font-bold text-xl text-brand-text" aria-label="Restro360 home">
            <img src="/src/assets/restro360_logo.svg" alt="Restro360" className="h-10 w-auto max-w-none" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm text-brand-sub hover:text-brand-text transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('#contact')}
              className="h-9 px-5 bg-brand-accent text-white text-sm font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              Book Demo
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-menu"
            className="md:hidden p-2 rounded-lg hover:bg-brand-muted transition-colors"
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-navigation-menu" className={menuOpen ? 'mobile-nav-open' : 'mobile-nav-closed'}>
          <div className="bg-white border-t border-brand-border/30 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-left px-4 py-2.5 text-sm text-brand-text hover:bg-brand-muted rounded-lg mx-2 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="px-4 pt-2 pb-1">
              <button
                onClick={() => scrollTo('#contact')}
                className="w-full h-10 bg-brand-accent text-white text-sm font-semibold rounded-xl"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
