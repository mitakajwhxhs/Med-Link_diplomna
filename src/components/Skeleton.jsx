export function DoctorCardSkeleton() {
  return (
    <article className="animate-pulse rounded-[16px] border border-[#E1E8F3] bg-white p-4 shadow-[0_16px_36px_rgba(13,46,139,0.07)]">
      <div className="grid gap-4 sm:grid-cols-[88px_minmax(0,1fr)_150px]">
        <div className="h-[88px] w-[88px] rounded-full bg-[#E8EEF7]" />
        <div className="min-w-0">
          <div className="h-5 w-2/3 rounded bg-[#E8EEF7]" />
          <div className="mt-3 h-4 w-1/3 rounded bg-[#E8EEF7]" />
          <div className="mt-5 flex gap-2">
            <div className="h-7 w-24 rounded bg-[#E8EEF7]" />
            <div className="h-7 w-28 rounded bg-[#E8EEF7]" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-7 w-20 rounded bg-[#E8EEF7]" />
            <div className="h-7 w-24 rounded bg-[#E8EEF7]" />
            <div className="h-7 w-20 rounded bg-[#E8EEF7]" />
          </div>
        </div>
        <div className="grid content-end gap-3">
          <div className="h-5 w-24 rounded bg-[#E8EEF7] sm:ml-auto" />
          <div className="h-11 w-full rounded-[10px] bg-[#E8EEF7]" />
        </div>
      </div>
    </article>
  )
}

export function StatCardSkeleton() {
  return (
    <article className="animate-pulse rounded-[14px] border border-[#E1E8F3] bg-white p-5 shadow-[0_16px_35px_rgba(13,46,139,0.07)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-4 w-28 rounded bg-[#E8EEF7]" />
          <div className="mt-4 h-8 w-20 rounded bg-[#E8EEF7]" />
        </div>
        <div className="h-11 w-11 rounded-[12px] bg-[#E8EEF7]" />
      </div>
      <div className="mt-5 h-4 w-44 rounded bg-[#E8EEF7]" />
    </article>
  )
}
