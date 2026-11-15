import { Card, Skeleton } from "@heroui/react";

export default function LoadingSkeleton() {
  return (
    <Card className="w-full bg-secondary p-6 text-foreground shadow-card">
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full sm:size-32" />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-8 w-full max-w-48 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-32 rounded-lg" />
            <Skeleton className="h-8 w-full max-w-28 rounded-lg" />
          </div>
        </div>

        <div className="flex min-w-0 gap-4 sm:gap-8">
          {[1, 2].map((item) => (
            <div key={item} className="flex min-w-0 flex-1 flex-col gap-1">
              <Skeleton className="h-6 w-16 rounded-lg" />
              <Skeleton className="h-4 w-full max-w-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}