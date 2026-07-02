import { Skeleton } from "@/components/ui/Skeleton";

export function SkeletonTable({ rows = 8 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-3.5 w-20 hidden md:block" />
          <Skeleton className="h-3.5 w-24 hidden lg:block" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-3.5 w-20 hidden sm:block" />
        </div>
      ))}
    </div>
  );
}
