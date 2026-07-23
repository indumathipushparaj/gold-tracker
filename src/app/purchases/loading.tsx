export default function Loading() {
  return (
    <div className="min-h-screen bg-[rgb(20,24,30)] px-4 py-10">
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="h-8 w-64 rounded bg-gray-700 mb-6" />

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl p-4 h-20" style={{ backgroundColor: 'rgb(32,38,48)' }}>
              <div className="h-3 w-20 rounded bg-gray-700 mb-2" />
              <div className="h-5 w-28 rounded bg-gray-600" />
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-6 space-y-3"
          style={{ backgroundColor: 'rgb(32,38,48)' }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded bg-gray-700/50" />
          ))}
        </div>
      </div>
    </div>
  );
}