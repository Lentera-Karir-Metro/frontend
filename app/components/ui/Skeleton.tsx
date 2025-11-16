export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function AuthSkeleton() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side Skeleton */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-300 animate-pulse items-end justify-start pl-16 pr-8 py-12">
        <div className="relative z-20 w-full max-w-lg pb-12 space-y-6">
          {/* Logo Skeleton */}
          <Skeleton className="h-12 w-32" />
          
          {/* Heading Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-4/5" />
          </div>
          
          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Right Side Skeleton */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo Skeleton */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Skeleton className="h-10 w-24" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Form Fields Skeleton */}
          <div className="space-y-6">
            {/* Input 1 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Input 2 */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-4 w-32 ml-auto" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-xl" />

            {/* Divider */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-px flex-1" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-px flex-1" />
            </div>

            {/* Google Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar skeleton */}
      <div className="h-20 md:h-24 bg-white border-b border-gray-200 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-28" />
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gray-100 py-12 md:py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <Skeleton className="h-12 w-1/3 mb-4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>

      {/* Stats */}
      <div className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>

      {/* Content list */}
      <div className="py-8 md:py-12 lg:py-16 bg-gray-50 flex-grow">
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
          <Skeleton className="h-8 w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
