import React, { useState, useEffect, useRef } from 'react';
import { SortOption } from '../types';
import { ChevronDownIcon, CheckIcon } from './Icons';

interface SortMenuProps {
  currentSortOption: SortOption;
  onSortOptionChange: (option: SortOption) => void;
}

const sortOptionsMap: { [key in SortOption]: string } = {
  [SortOption.DateNewest]: 'Date: Newest First',
  [SortOption.DateOldest]: 'Date: Oldest First',
  [SortOption.TitleAZ]: 'Title: A-Z',
  [SortOption.TitleZA]: 'Title: Z-A',
};

const SortMenu: React.FC<SortMenuProps> = ({ currentSortOption, onSortOptionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: SortOption) => {
    onSortOptionChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <label htmlFor="sort-menu-button" className="sr-only">Sort tasks</label>
      <button
        id="sort-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-md px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>Sort by: <span className="font-semibold">{sortOptionsMap[currentSortOption]}</span></span>
        <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="sort-menu-button"
        >
          <div className="py-1" role="none">
            {Object.entries(sortOptionsMap).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleSelect(key as SortOption)}
                className="w-full text-left flex justify-between items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700"
                role="menuitem"
              >
                <span>{label}</span>
                {currentSortOption === key && <CheckIcon className="h-5 w-5 text-sky-600 dark:text-sky-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SortMenu);