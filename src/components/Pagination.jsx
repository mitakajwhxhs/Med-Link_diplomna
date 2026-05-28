import { ChevronLeft, ChevronRight } from 'lucide-react'

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'end-ellipsis', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'start-ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    'start-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'end-ellipsis',
    totalPages,
  ]
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPageItems(currentPage, totalPages)

  const goToPage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    onPageChange(nextPage)
  }

  return (
    <nav
      className="mt-6 flex flex-wrap items-center justify-center gap-2"
      aria-label="Страници"
    >
      <button
        type="button"
        className={`inline-grid h-12 w-12 place-items-center rounded-[12px] border border-[#DCE5F0] bg-white transition hover:border-[#13B5C8] hover:text-[#0D2E8B] ${
          currentPage === 1 ? 'text-[#9AA7C2]' : 'text-[#0D2E8B]'
        }`}
        aria-label="Предишна страница"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      {pages.map((page) =>
        typeof page === 'string' ? (
          <span
            key={page}
            className="inline-grid h-12 min-w-12 place-items-center rounded-[12px] border border-[#DCE5F0] bg-white px-3 text-[14px] font-extrabold text-[#0D2E8B]"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`h-12 min-w-12 rounded-[12px] px-4 text-[15px] font-extrabold transition ${
              page === currentPage
                ? 'bg-[#13B5C8] text-white shadow-[0_12px_22px_rgba(19,181,200,0.22)]'
                : 'border border-[#DCE5F0] bg-white text-[#0D2E8B] hover:border-[#13B5C8] hover:text-[#087F91]'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className={`inline-grid h-12 w-12 place-items-center rounded-[12px] border border-[#DCE5F0] bg-white transition hover:border-[#13B5C8] hover:text-[#087F91] ${
          currentPage === totalPages ? 'text-[#9AA7C2]' : 'text-[#0D2E8B]'
        }`}
        aria-label="Следваща страница"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  )
}
