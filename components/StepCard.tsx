import { LucideIcon } from 'lucide-react';

interface StepCardProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  isLast?: boolean;
}

export default function StepCard({ step, icon: Icon, title, description, isLast }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Step number + icon */}
      <div className="relative mb-4">
        <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center">
          <Icon size={26} className="text-brand-accent" />
        </div>
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">{step}</span>
        </div>
      </div>

      {/* Dashed connector (desktop only, not on last item) */}
      {!isLast && (
        <div className="hidden md:block absolute top-7 left-[calc(50%+40px)] right-0 h-px border-t-2 border-dashed border-brand-border" />
      )}

      <h3 className="text-sm font-bold text-brand-text mb-1">{title}</h3>
      <p className="text-xs text-brand-sub leading-relaxed max-w-[140px]">{description}</p>
    </div>
  );
}
