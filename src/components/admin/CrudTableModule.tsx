import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  ArrowUpDown,
  MapPin,
  Tag,
  X,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  sortableKey?: string;
  className?: string;
}

interface CrudTableModuleProps<T extends { id: string }> {
  title: string;
  subtitle: string;
  items: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  filterOptions?: { label: string; key: string; values: string[] }[];
  onAddNew: () => void;
  onEdit: (item: T) => void;
  onView: (item: T) => void;
  onDelete: (id: string) => void;
  onToggleStatus?: (item: T) => void;
  statusAccessor?: (item: T) => 'Published' | 'Draft' | 'Under Review' | string;
  idKey?: keyof T;
  isLoading?: boolean;
}

export function CrudTableModule<T extends { id: string }>({
  title,
  subtitle,
  items = [],
  columns,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  onAddNew,
  onEdit,
  onView,
  onDelete,
  onToggleStatus,
  statusAccessor,
  isLoading = false,
}: CrudTableModuleProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Search and filter logic
  const filteredItems = items.filter((item) => {
    // Search query matching across JSON stringified values
    const itemString = JSON.stringify(item).toLowerCase();
    const matchesSearch = !searchQuery || itemString.includes(searchQuery.toLowerCase());

    // Filter matching
    const matchesFilters = Object.entries(activeFilters).every(([key, val]) => {
      if (!val || val === 'All') return true;
      const fieldVal = (item as any)[key];
      return String(fieldVal) === val;
    });

    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const hasActiveFilters = Boolean(searchQuery || Object.values(activeFilters).some(v => v && v !== 'All'));

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Table Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">{title}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono font-bold text-xs">
              {items.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        <button
          onClick={onAddNew}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#0F4C3A] hover:from-emerald-700 hover:to-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Add New Record</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/70 font-medium placeholder:text-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Filter Select Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {filterOptions.length > 0 && (
            <div className="flex items-center space-x-1.5 text-xs text-slate-400 mr-1 hidden sm:flex">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
          )}

          {filterOptions.map((f) => (
            <select
              key={f.key}
              value={activeFilters[f.key] || 'All'}
              onChange={(e) => {
                setActiveFilters({ ...activeFilters, [f.key]: e.target.value });
                setCurrentPage(1);
              }}
              className="p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/70 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
            >
              <option value="All">{f.label}: All</option>
              {f.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          ))}

          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilters({});
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Head */}
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3.5 px-4 sm:px-5 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
                {statusAccessor && <th className="py-3.5 px-4">Status</th>}
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, ci) => (
                      <td key={ci} className="p-4 sm:p-5">
                        <div className="h-4 bg-slate-100 rounded-lg w-3/4"></div>
                      </td>
                    ))}
                    {statusAccessor && (
                      <td className="p-4"><div className="h-4 bg-slate-100 rounded-full w-16"></div></td>
                    )}
                    <td className="p-4">
                      <div className="flex justify-end space-x-2">
                        <div className="h-7 w-7 bg-slate-100 rounded-xl"></div>
                        <div className="h-7 w-7 bg-slate-100 rounded-xl"></div>
                        <div className="h-7 w-7 bg-slate-100 rounded-xl"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="py-14 px-4 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="font-serif font-bold text-base text-slate-800">No records found</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Try adjusting your search keywords or clear your selected filters to view results.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const statusVal = statusAccessor ? statusAccessor(item) : null;
                  const isPublished = statusVal === 'Published' || statusVal === 'Active';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                      {columns.map((col, idx) => (
                        <td key={idx} className={`py-3.5 px-4 sm:px-5 align-middle ${col.className || ''}`}>
                          {col.accessor(item)}
                        </td>
                      ))}

                      {/* Optional Status Column with 1-Click Toggle */}
                      {statusAccessor && (
                        <td className="py-3.5 px-4 align-middle">
                          {onToggleStatus ? (
                            <button
                              onClick={() => onToggleStatus(item)}
                              title="Click to toggle status"
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer shadow-2xs ${
                                isPublished
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              <span>{statusVal}</span>
                            </button>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1.5 ${
                              isPublished 
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                : 'bg-amber-50 text-amber-900 border border-amber-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              <span>{statusVal}</span>
                            </span>
                          )}
                        </td>
                      )}

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right align-middle space-x-1.5">
                        <button
                          onClick={() => onView(item)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                          title="Preview Item Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors cursor-pointer shadow-2xs"
                          title="Edit Item"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(item.id)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer shadow-2xs"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <span>
            Showing <strong className="text-slate-800">{paginatedItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</strong> of{' '}
            <strong className="text-slate-800">{filteredItems.length}</strong> records
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <span className="font-mono font-bold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer flex items-center space-x-1 shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Dialog Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl space-y-4 border border-rose-200 text-center animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to permanently remove this record from the Voice of Sufism database? This operation cannot be undone.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
