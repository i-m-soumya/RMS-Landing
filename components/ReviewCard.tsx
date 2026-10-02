interface ReviewCardProps {
  name: string;
  role: string;
  rating: number;
  text: string;
  color: string;
}

export default function ReviewCard({ name, role, rating, text, color }: ReviewCardProps) {
  return (
    <div className="feature-card bg-white rounded-2xl p-4 shadow-card border border-brand-border/30 w-64 shrink-0 mr-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: color }}
        >
          {name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-brand-text truncate">{name}</p>
          <p className="text-xs text-brand-sub truncate">{role}</p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} className={s <= rating ? 'text-brand-rating' : 'text-brand-border'} style={{ fontSize: 14 }}>
            ★
          </span>
        ))}
      </div>

      <p className="text-xs text-brand-sub leading-relaxed line-clamp-3">{text}</p>
    </div>
  );
}
