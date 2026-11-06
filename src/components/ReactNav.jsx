import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function ReactNav({ links = [], logoUrl = '/favicon.svg', signupLabel = 'Start free for 3 months', signupUrl = '/signup' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <nav className="nav-shell fixed inset-x-0 top-0 z-50" aria-label="Main navigation">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <a href="#top" className="nav-logo-wrap flex items-center gap-2" aria-label="Restro360 home">
            <img src={logoUrl} alt="Restro360" className="h-10 w-auto max-w-none" />
          </a>

          <div className="hidden items-center gap-5 lg:flex">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="desktop-nav-link text-sm font-medium transition-colors">
                {link.label}
              </a>
            ))}
            <a href={signupUrl} className="nav-trial-cta">{signupLabel}</a>
            <a href="#contact" className="nav-demo-link">Book a Free Demo</a>
          </div>

          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-3 text-white hover:bg-white/10 lg:hidden"
            style={{ minWidth: '44px', minHeight: '44px' }}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {menuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        <div id="mobile-navigation-menu" className={menuOpen ? 'mobile-nav-open' : 'mobile-nav-closed'} aria-hidden={!menuOpen}>
          <div className="border-t border-slate-200 bg-white py-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="mx-2 flex min-h-11 items-center rounded-lg px-4 text-sm font-medium text-slate-800 hover:bg-blue-50 focus-visible:outline"
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pb-1 pt-2">
              <a href={signupUrl} onClick={closeMenu} className="nav-mobile-trial">{signupLabel}</a>
              <a href="#contact" onClick={closeMenu} className="nav-mobile-demo">Book a Free Demo</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
