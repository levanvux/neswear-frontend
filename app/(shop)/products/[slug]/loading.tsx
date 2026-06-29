import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto grid gap-16 md:grid-cols-2 px-6 py-10">
      <Skeleton className="aspect-square w-full rounded-xl" />

      <section className="space-y-10">
        <Skeleton className="h-4 w-20" />

        <Skeleton className="h-10 w-64" />

        <Skeleton className="h-8 w-36" />

        <Skeleton className="h-8 w-36" />

        <Skeleton className="h-8 w-36" />

        <Skeleton className="h-10 w-64" />
      </section>
    </div>
  );
}
