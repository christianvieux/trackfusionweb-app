import { Skeleton } from "@heroui/react";

function SkeletonLine({ className = "" }) {
  return <Skeleton className={`rounded-lg ${className}`} />;
}

export default function LoadingSkeleton() {
  return (
    <div className="w-full rounded-[14px] border border-success/25 bg-[rgba(8,8,22,.72)] p-3 text-foreground shadow-card sm:p-5">
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-[minmax(260px,320px)_minmax(0,1fr)] md:gap-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="aspect-square w-full rounded-xl" />

          <div className="flex items-start justify-between px-2">
            <div className="flex gap-2">
              <SkeletonLine className="h-4 w-8" />
              <SkeletonLine className="h-4 w-24" />
            </div>

            <div className="flex items-center gap-2">
              <SkeletonLine className="h-4 w-16" />
              <SkeletonLine className="h-4 w-8" />
            </div>
          </div>

          <div className="flex items-center gap-2 px-2">
            <Skeleton className="size-2 rounded-full" />
            <SkeletonLine className="h-4 w-16" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <SkeletonLine className="h-8 w-3/4" />
          <SkeletonLine className="h-6 w-1/2" />
          <SkeletonLine className="h-4 w-32" />

          <SkeletonLine className="h-24 w-full" />

          <div className="space-y-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="flex gap-2">
                <SkeletonLine className="h-6 w-16" />
                <SkeletonLine className="h-6 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
