import { ArrowRight, Check, ChevronRight, CircleDot, QrCode, ScanLine, Sparkles } from 'lucide-react';
import { siteContent } from '../src/content/siteContent';
import { SIGNUP_URL } from '../src/config';

export default function HeroSection() {
  return (
    <section className="landing-hero min-h-screen flex items-center pt-16 overflow-hidden" aria-labelledby="restro360-hero-heading">
      <div className="landing-grid-glow" />
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-20 w-full relative z-10">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-12 lg:gap-10 items-center">
          <div className="landing-fade-in max-w-xl">
            <div className="landing-kicker"><CircleDot size={13} /> {siteContent.hero.kicker}</div>
            <h1 id="restro360-hero-heading" className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white leading-[0.95] tracking-[-0.04em] mb-5">
              {siteContent.hero.heading}
            </h1>
            <p className="text-[#b8c5c4] text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              {siteContent.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={SIGNUP_URL} className="landing-primary-cta" aria-label="Start free for 3 months">
                {siteContent.hero.primaryCta} <ArrowRight size={17} />
              </a>
              <a href={SIGNUP_URL} className="landing-secondary-cta" aria-label="Book a Free Demo">
                {siteContent.hero.secondaryCta} <ChevronRight size={17} />
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-9 text-xs text-[#b8c5c4]">
              {siteContent.hero.benefits.map((item) => (
                <span key={item} className="flex items-center gap-1.5"><Check size={14} className="text-[#06B6D4]" />{item}</span>
              ))}
            </div>
          </div>

          <div className="landing-stage" aria-label="Illustrative dashboard preview">
            <div className="landing-orbit orbit-one" />
            <div className="landing-orbit orbit-two" />
            <div className="landing-console float-animate">
              <div className="console-topbar">
                <div className="flex items-center gap-2"><span className="console-dot bg-[#2563EB]" /><span className="console-dot bg-[#06B6D4]" /><span className="console-dot bg-white" /></div>
                <span className="font-mono text-[10px] text-[#93a6a4]">{siteContent.hero.dashboardLabel}</span>
              </div>
              <div className="console-content">
                <div className="flex items-start justify-between mb-6">
                  <div><p className="text-[10px] uppercase tracking-[0.2em] text-[#93a6a4]">Tonight at</p><h2 className="font-display text-2xl text-white">{siteContent.hero.dashboardTitle}</h2></div>
                  <div className="live-pill"><span /> {siteContent.hero.tableStatus}</div>
                </div>
                <div className="console-stat-grid">
                  <div><p className="console-label">{siteContent.hero.ordersToday}</p><p className="console-number">KOT</p><span className="console-up">Live queue</span></div>
                  <div><p className="console-label">{siteContent.hero.avgTableTime}</p><p className="console-number">GST</p><span className="console-muted">Ready billing</span></div>
                </div>
                <div className="console-order-card">
                  <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="table-badge">QR</span><div><p className="text-sm text-white font-semibold">{siteContent.hero.newOrder}</p><p className="text-[10px] text-[#E2E8F0]">{siteContent.hero.justNow}</p></div></div><Sparkles size={16} className="text-[#06B6D4]" /></div>
                  <div className="flex items-center gap-2 text-xs text-[#E2E8F0]"><span className="order-line" /><span>{siteContent.hero.kitchenNotified}</span><span className="ml-auto text-[#06B6D4]">{siteContent.hero.onTrack}</span></div>
                </div>
                <div className="console-menu-row"><div className="menu-thumb thumb-green" /><div><p className="text-xs text-white font-semibold">Menu and stock</p><p className="text-[10px] text-[#E2E8F0]">Availability alerts</p></div></div>
              </div>
            </div>
            <div className="landing-float-card landing-qr-card"><ScanLine size={22} className="text-[#06B6D4]" /><div><p className="text-xs text-white font-semibold">{siteContent.hero.scanToOrder}</p><p className="text-[10px] text-[#E2E8F0]">{siteContent.hero.noDownload}</p></div></div>
            <div className="landing-float-card landing-seat-card"><div className="seat-ring">12</div><div><p className="text-xs text-white font-semibold">{siteContent.hero.table12}</p><p className="text-[10px] text-[#93a6a4]">{siteContent.hero.guestOrdering}</p></div></div>
            <div className="landing-qr-pattern"><QrCode size={70} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
