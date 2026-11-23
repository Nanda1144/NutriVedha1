import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-soft-beige rounded-b-xl text-xs text-warm-brown">
      <div>
        {totalItems !== undefined && pageSize !== undefined ? (
          <span>
            Showing <strong className="text-charcoal">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</strong> to{' '}
            <strong className="text-charcoal">{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
            <strong className="text-charcoal">{totalItems}</strong> entries
          </span>
        ) : (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-soft-beige bg-white hover:bg-cream hover:border-sage text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-semibold text-charcoal">
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-soft-beige bg-white hover:bg-cream hover:border-sage text-charcoal disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
