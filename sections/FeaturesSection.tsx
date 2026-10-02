import {
  QrCode, Smartphone, Users, RefreshCw,
  Palette, Share2, Zap, ClipboardList,
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import { siteContent } from '../src/content/siteContent';

const features = siteContent.features.map((feature, index) => ({
  icon: [QrCode, Smartphone, Users, RefreshCw, Palette, Share2, Zap, ClipboardList][index],
  title: feature.title,
  description: feature.description,
  color: 'text-brand-accent',
  bgColor: 'bg-brand-accent/10',
}));

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 bg-white" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 id="features-heading" className="font-display text-3xl font-bold text-brand-text mb-3">
            {siteContent.sections.features.heading}
          </h2>
          <p className="text-brand-sub max-w-xl mx-auto">
            {siteContent.sections.features.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
