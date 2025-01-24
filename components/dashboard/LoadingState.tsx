import { Skeleton } from '../ui/skeleton';

export function DashboardLoadingState() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Stats Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>

      {/* Sales Target and Top Products Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 