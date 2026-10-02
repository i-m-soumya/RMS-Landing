import { Home, ArrowLeft, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const appName = import.meta.env.VITE_APP_NAME || 'Restro360';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-orange-50 flex flex-col">
      <Helmet>
        <title>404 — Page Not Found · {appName}</title>
      </Helmet>
      {/* Minimal nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <a href="/" className="flex items-center gap-2 font-bold text-lg text-brand-text">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🍽️</span>
          </div>
          <span>{appName}</span>
        </a>
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-brand-sub hover:text-brand-text transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Back to Home
        </a>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* 404 visual */}
          <div className="relative mb-8">
            <div className="text-[120px] font-display font-bold text-brand-accent/10 leading-none select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
                <Search size={36} className="text-brand-accent" />
              </div>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-brand-text mb-3">
            Page Not Found
          </h1>
          <p className="text-brand-sub leading-relaxed mb-8">
            The page you're looking for doesn't exist or has been moved.
            If you're a restaurant customer, please scan the QR code at your table to get started.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-brand-accent text-white font-bold rounded-xl hover:brightness-110 transition-all shadow-md"
            >
              <Home size={18} />
              Go to Homepage
            </a>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 border-2 border-brand-border text-brand-text font-semibold rounded-xl hover:bg-brand-muted transition-all"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>

          {/* Hint for restaurant users */}
          <div className="mt-10 bg-white/70 backdrop-blur-sm rounded-2xl border border-brand-border/30 p-4 shadow-sm">
            <p className="text-xs font-semibold text-brand-text mb-2">📱 Restaurant Customer?</p>
            <p className="text-xs text-brand-sub leading-relaxed">
              Restaurant URLs follow the format:<br />
              <span className="font-mono text-brand-accent">yourdomain.com/restaurant-name/table-id</span><br />
              Please scan the QR code at your table for the correct link.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-brand-sub/50">© {new Date().getFullYear()} {appName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
