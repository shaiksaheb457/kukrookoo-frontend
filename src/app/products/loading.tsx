export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-cream pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse shadow-card" />
          ))}
        </div>
      </div>
    </div>
  );
}