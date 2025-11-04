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
