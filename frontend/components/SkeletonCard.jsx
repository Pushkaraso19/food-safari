/**
 * SkeletonCard — animated loading placeholder for CatererCard
 */
export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
      <div className="h-1 w-full bg-[var(--bg-card-hover)]" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="skeleton h-5 w-36 rounded-md" />
            <div className="skeleton h-3 w-24 rounded-md" />
          </div>
          <div className="skeleton h-10 w-12 rounded-md" />
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-24 rounded-full" />
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col gap-1">
            <div className="skeleton h-3 w-20 rounded-md" />
            <div className="skeleton h-7 w-16 rounded-md" />
          </div>
          <div className="skeleton h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
