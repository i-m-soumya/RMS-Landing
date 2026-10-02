import { UserPlus, QrCode, UtensilsCrossed, ClipboardCheck } from 'lucide-react';
import StepCard from '../components/StepCard';

const steps = [
  { icon: UserPlus, title: 'Set Up Your Outlet', description: 'Sign up and configure your outlet profile, menu, and pricing.' },
  { icon: QrCode, title: 'Map Inventory & Recipes', description: 'Import or add inventory and connect ingredients to recipe costing.' },
  { icon: UtensilsCrossed, title: 'Train Your Team', description: 'Get staff comfortable with billing in under a day, with no technical skills needed.' },
  { icon: ClipboardCheck, title: 'Go Live & See Everything', description: 'Track sales, stock, staff, and outlet performance from your dashboard.' },
];

export default function HowItWorksRestaurant() {
  return (
    <section id="how-it-works" className="py-16 bg-brand-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">For Restaurant Owners</span>
          <h2 className="font-display text-3xl font-bold text-brand-text mt-2 mb-3">
            Up and Running in Four Simple Steps
          </h2>
          <p className="text-brand-sub max-w-md mx-auto">
            Most restaurants are fully live within 30 minutes, with dedicated setup support included.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <StepCard
              key={step.title}
              step={i + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
