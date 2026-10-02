import { QrCode, BookOpen, Users, ShoppingCart, ClipboardList } from 'lucide-react';

const steps = [
  { icon: QrCode, title: 'Scan the QR Code', description: 'Point your phone camera at the QR code on your table. No app needed.' },
  { icon: BookOpen, title: 'Browse the Menu', description: 'Explore the full menu with photos, descriptions, and prices.' },
  { icon: Users, title: 'Join Your Table', description: 'Friends can join your session using a shared 4-digit PIN to order together.' },
  { icon: ShoppingCart, title: 'Add & Order', description: 'Add items to your order and submit. The kitchen gets notified instantly.' },
  { icon: ClipboardList, title: 'Track Your Order', description: 'See your order status in real-time. Request the bill when you\'re done.' },
];

export default function HowItWorksCustomer() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">For Your Team</span>
          <h2 className="font-display text-3xl font-bold text-brand-text mt-2 mb-3">
            One Connected View for Every Outlet
          </h2>
          <p className="text-brand-sub max-w-md mx-auto">
            From the counter to the kitchen, Restro360 keeps daily operations moving in one place.
          </p>
        </div>

        {/* Horizontal scroll on mobile, row on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-start">
          {steps.map((step, i) => (
            <div key={step.title} className="flex sm:flex-col items-start sm:items-center sm:text-center flex-1 gap-4 sm:gap-0">
              {/* Icon + connector */}
              <div className="flex sm:flex-col items-center sm:mb-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center shrink-0">
                  <step.icon size={22} className="text-brand-accent" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 h-px sm:w-px sm:h-6 bg-brand-border border-dashed sm:mx-auto hidden sm:block" />
                )}
              </div>

              {/* Text */}
              <div className="sm:px-1">
                <div className="flex items-center gap-2 sm:justify-center mb-1">
                  <span className="w-5 h-5 bg-brand-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm font-bold text-brand-text">{step.title}</p>
                </div>
                <p className="text-xs text-brand-sub leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
