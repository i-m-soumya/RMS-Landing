import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export default function FeatureCard({ icon: Icon, title, description, color, bgColor }: FeatureCardProps) {
  return (
    <div className="feature-card bg-white rounded-2xl p-5 border border-brand-border/30 shadow-card">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${bgColor}`}>
        <Icon size={22} className={color} />
      </div>
      <h3 className="text-base font-bold text-brand-text mb-2">{title}</h3>
      <p className="text-sm text-brand-sub leading-relaxed">{description}</p>
    </div>
  );
}
