import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found matching criteria.',
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="py-12 bg-white rounded-xl border border-soft-beige">
        <LoadingSpinner size="md" text="Loading enterprise records..." />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-soft-beige bg-white shadow-earth-sm">
      <table className="min-w-full divide-y divide-soft-beige text-left text-sm text-charcoal">
        <thead className="bg-cream/60 text-xs font-semibold uppercase tracking-wider text-teal">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} scope="col" className={`px-4 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-soft-beige/80">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-warm-brown">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-cream/30 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className={`px-4 py-3 text-xs sm:text-sm ${col.className || ''}`}>
                    {col.cell ? col.cell(item) : col.accessor ? String(item[col.accessor] ?? '') : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
