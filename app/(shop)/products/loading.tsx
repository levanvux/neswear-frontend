import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 p-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-36 md:h-64 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  );
}
