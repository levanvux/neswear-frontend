import { Skeleton } from "./ui/skeleton";

export default function DetailSkeleton() {
  new Promise((res) => setTimeout(res, 5000)).then();

  return (
    <main className="mx-4 my-6 space-y-5 md:mx-auto md:my-10 md:max-w-4xl">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-40" />

        <div className="mt-5">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
      </div>

      {/* Other... */}
      {[1, 2, 3].map((value) => (
        <div key={value} className="rounded-xl border bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-2 h-8 w-24" />
            </div>

            <Skeleton className="h-7 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </main>
  );
}
