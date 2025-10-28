import React from 'react';
import { TrashIcon } from './Icons';

interface BulkActionBarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onBulkDelete: () => void;
  isAllSelected: boolean;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({ selectedCount, onSelectAll, onBulkDelete, isAllSelected }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-700 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-30 transition-transform transform-gpu">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onSelectAll}
            className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            aria-label="Select all visible tasks"
          />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {selectedCount} selected
          </span>
        </div>
        <button
          onClick={onBulkDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-zinc-900 transition-colors"
        >
          <TrashIcon className="w-5 h-5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(BulkActionBar);
