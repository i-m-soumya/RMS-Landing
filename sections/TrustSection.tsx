import ReviewCard from '../components/ReviewCard';

const OWNER_REVIEWS = [
  { name: 'Rajesh Sharma', role: 'Owner, The Spice Garden', rating: 5, text: 'Setup took less than 10 minutes. Orders went up 30% in the first week. Our staff can now focus on serving instead of taking orders.', color: '#FF5722' },
  { name: 'Priya Nair', role: 'Manager, Cafe Bloom', rating: 5, text: 'Finally a solution that works without forcing customers to download an app. Very clean interface, even our older customers love it.', color: '#4CAF50' },
  { name: 'Amir Khan', role: 'Owner, Burger House', rating: 5, text: "The group ordering feature is brilliant. Tables with large groups can all add their own items. No more confusion or missed items.", color: '#2196F3' },
  { name: 'Sunita Patel', role: 'Director, Cafe Delight', rating: 4, text: 'Real-time menu updates are fantastic. We can mark items as unavailable instantly without reprinting any menus.', color: '#9C27B0' },
  { name: 'Vikram Singh', role: 'Owner, The Crown Kitchen', rating: 5, text: 'QR ordering cut our order errors by almost 80%. Customers get exactly what they want and the kitchen gets clear instructions.', color: '#FF9800' },
  { name: 'Meena Reddy', role: 'Owner, South Spice', rating: 5, text: 'Best investment we made this year. The demo was clear, setup was fast, and support team is always responsive.', color: '#009688' },
];

const CUSTOMER_REVIEWS = [
  { name: 'Ananya K.', role: 'Regular Diner', rating: 5, text: 'So convenient! Just scanned the QR at the table and ordered directly from my phone. No waiting for the waiter to take my order.', color: '#E91E63' },
  { name: 'Rohan Mehta', role: 'Tech Professional', rating: 5, text: 'Went with 6 friends and we all ordered individually on our phones. Everything came out together perfectly. Loved the experience.', color: '#3F51B5' },
  { name: 'Divya S.', role: 'Food Blogger', rating: 4, text: 'The menu photos are great and it shows preparation time for each dish. Helps you plan your meal. Would love to see more customization options.', color: '#FF5722' },
  { name: 'Kartik Joshi', role: 'Student', rating: 5, text: 'Ordered without logging in, which was super convenient. The 4-digit code to join my friend\'s table was genius — we could all add items together!', color: '#607D8B' },
  { name: 'Nisha Gupta', role: 'Working Professional', rating: 5, text: 'Loved being able to track my order in real-time. I knew exactly when it was being prepared and when it was ready. Modern and fast!', color: '#8BC34A' },
  { name: 'Arjun Dev', role: 'Frequent Diner', rating: 5, text: 'Clean UI, fast loading, works perfectly on my older Android phone. The bill request feature saved so much time at the end.', color: '#FF9800' },
];

function MarqueeRow({ reviews, direction }: { reviews: typeof OWNER_REVIEWS; direction: 'left' | 'right' }) {
  const doubled = [...reviews, ...reviews]; // duplicate for seamless loop
  return (
    <div className="marquee-wrapper overflow-hidden">
      <div className={direction === 'left' ? 'marquee-track-left' : 'marquee-track-right'}>
        {doubled.map((r, i) => (
          <ReviewCard key={i} {...r} />
        ))}
      </div>
    </div>
  );
}

export default function TrustSection() {
  return (
    <section className="py-16 bg-brand-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-brand-text mb-3">
          Built for Restaurants That Can't Afford Downtime
        </h2>
        <p className="text-brand-sub">From single cafes to multi-outlet chains, keep billing fast, stock accurate, and operations visible every day.</p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-brand-sub uppercase tracking-wider px-6 mb-3">Restaurant Owners</p>
          <MarqueeRow reviews={OWNER_REVIEWS} direction="left" />
        </div>
        <div>
          <p className="text-xs font-semibold text-brand-sub uppercase tracking-wider px-6 mb-3">Customers</p>
          <MarqueeRow reviews={CUSTOMER_REVIEWS} direction="right" />
        </div>
      </div>
    </section>
  );
}
