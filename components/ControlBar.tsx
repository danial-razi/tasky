import React from 'react';
import FilterControls from './FilterControls';
import SortMenu from './SortMenu';
import { SortOption, FilterStatus } from '../types';

interface ControlBarProps {
  allTags: string[];
  statusFilter: FilterStatus;
  tagFilter: string | null;
  searchQuery: string;
  sortOption: SortOption;
  onStatusFilterChange: (status: FilterStatus) => void;
  onTagFilterChange: (tag: string | null) => void;
  onSearchQueryChange: (query: string) => void;
  onSortOptionChange: (option: SortOption) => void;
}

const ControlBar: React.FC<ControlBarProps> = (props) => {
  const { 
    allTags,
    statusFilter,
    tagFilter,
    searchQuery,
    sortOption,
    onStatusFilterChange,
    onTagFilterChange,
    onSearchQueryChange,
    onSortOptionChange
  } = props;

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div className="flex-grow">
        <FilterControls
          allTags={allTags}
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          onStatusFilterChange={onStatusFilterChange}
          onTagFilterChange={onTagFilterChange}
          searchQuery={searchQuery}
          onSearchQueryChange={onSearchQueryChange}
        />
      </div>
      <div className="flex-shrink-0 w-full md:w-auto">
        <SortMenu 
          currentSortOption={sortOption}
          onSortOptionChange={onSortOptionChange}
        />
      </div>
    </div>
  );
};

export default React.memo(ControlBar);
