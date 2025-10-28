import React, { useState, useRef, useEffect } from 'react';
import { FilterStatus, TaskStatus } from '../types';
import { XCircleIcon, SearchIcon, ChevronDownIcon } from './Icons';

interface FilterControlsProps {
  allTags: string[];
  statusFilter: FilterStatus;
  tagFilter: string | null;
  searchQuery: string;
  onStatusFilterChange: (status: FilterStatus) => void;
  onTagFilterChange: (tag: string | null) => void;
  onSearchQueryChange: (query: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  allTags,
  statusFilter,
  tagFilter,
  searchQuery,
  onStatusFilterChange,
  onTagFilterChange,
  onSearchQueryChange,
}) => {

  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [tagSearch, setTagSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTagSelect = (tag: string | null) => {
    onTagFilterChange(tag);
    setIsTagDropdownOpen(false);
    setTagSearch(''); // reset search on select
  };

  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: TaskStatus.Pending, label: 'Pending' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Paused, label: 'Paused' },
  ];

  const getStatusButtonClass = (value: FilterStatus) => {
    const base = "px-3 py-1 text-sm font-medium rounded-md transition-colors";
    const active = "bg-sky-600 text-white";
    const inactive = "bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700";
    return `${base} ${statusFilter === value ? active : inactive}`;
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm space-y-4">
      <div>
        <label htmlFor="search-tasks" className="sr-only">Search Tasks</label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                id="search-tasks"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search tasks by title or tag..."
                className="w-full p-2 pl-10 border border-slate-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
            />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(({ value, label }) => (
            <button key={value} onClick={() => onStatusFilterChange(value)} className={getStatusButtonClass(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {allTags.length > 0 && (
        <div ref={dropdownRef}>
          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Filter by Tag</h3>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
              className="w-full flex justify-between items-center p-2 border border-slate-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition text-left"
              aria-haspopup="listbox"
              aria-expanded={isTagDropdownOpen}
            >
              <span className={tagFilter ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}>
                {tagFilter || 'Select a tag...'}
              </span>
              <div className="flex items-center">
                {tagFilter && (
                  <button
                    aria-label="Clear tag filter"
                    className="mr-2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTagSelect(null);
                    }}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
                <ChevronDownIcon className={`h-5 w-5 text-slate-400 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {isTagDropdownOpen && (
              <div className="absolute mt-1 w-full rounded-md bg-white dark:bg-zinc-800 shadow-lg z-20 border dark:border-zinc-700">
                <div className="p-2">
                  <input
                    type="text"
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                    placeholder="Search tags..."
                    autoFocus
                    className="w-full p-2 border border-slate-300 rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                  />
                </div>
                <ul className="max-h-60 overflow-auto py-1" role="listbox">
                  <li
                    onClick={() => handleTagSelect(null)}
                    className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 cursor-pointer"
                    role="option"
                    aria-selected={tagFilter === null}
                  >
                    All Tags
                  </li>
                  {filteredTags.map(tag => (
                    <li
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700 cursor-pointer"
                      role="option"
                      aria-selected={tagFilter === tag}
                    >
                      {tag}
                    </li>
                  ))}
                  {filteredTags.length === 0 && tagSearch && (
                    <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 text-center">No tags found.</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(FilterControls);