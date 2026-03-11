export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="min-h-[70vh] bg-gray-800 flex items-end">
        <div className="w-full px-6 py-20">
          <div className="container mx-auto max-w-3xl space-y-4">
            <div className="w-32 h-4 bg-gray-600 rounded animate-pulse" />
            <div className="w-3/4 h-16 bg-gray-700 rounded animate-pulse" />
            <div className="w-1/2 h-6 bg-gray-600 rounded animate-pulse" />
            <div className="flex gap-4 pt-2">
              <div className="w-28 h-12 bg-gray-600 rounded-full animate-pulse" />
              <div className="w-36 h-12 bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructor skeleton */}
      <div className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="w-24 h-3 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="flex gap-8 items-start">
            <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="w-48 h-7 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA skeleton */}
      <div className="py-20 px-6 bg-primary">
        <div className="container mx-auto max-w-2xl text-center space-y-6">
          <div className="w-64 h-12 bg-white/20 rounded animate-pulse mx-auto" />
          <div className="flex justify-center gap-10">
            <div className="w-24 h-20 bg-white/10 rounded animate-pulse" />
            <div className="w-24 h-20 bg-white/10 rounded animate-pulse" />
            <div className="w-24 h-20 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="w-48 h-12 bg-white/20 rounded animate-pulse mx-auto" />
        </div>
      </div>
    </>
  );
}
