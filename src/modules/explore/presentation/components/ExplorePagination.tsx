interface ExplorePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ExplorePagination({
  page,
  totalPages,
  onPageChange,
}: ExplorePaginationProps) {
  if (totalPages <= 1) return null;

  // Build page numbers to display (max 7 visible)
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | '...')[] = [1];
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-[#5a6278] hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-[#3d4560] text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all border ${
              p === page
                ? 'bg-[#7c6bec] border-[#7c6bec] text-white shadow-[0_0_12px_rgba(124,107,236,0.4)]'
                : 'border-white/10 text-[#5a6278] hover:text-white hover:border-white/20'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-[#5a6278] hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
