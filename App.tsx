import React, { useState, useMemo, useCallback } from 'react';
import Header from './components/Header';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import ControlBar from './components/ControlBar';
import TagManager from './components/TagManager';
import BulkActionBar from './components/BulkActionBar';
import ConfirmationDialog from './components/ConfirmationDialog';
import { useTheme } from './hooks/useTheme';
import { useTasks } from './hooks/useTasks';
import { exportToJSON, exportToCSV } from './utils/export';
import { SortOption, FilterStatus } from './types';


const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const {
    tasks,
    addTask,
    deleteTask,
    toggleTaskComplete,
    updateTask,
    startTimer,
    pauseTimer,
    stopTimer,
    undo,
    redo,
    canUndo,
    canRedo,
    renameTag,
    deleteTag,
    deleteMultipleTasks,
  } = useTasks();

  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DateNewest);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const handleToggleTaskSelection = useCallback((id: string) => {
    setSelectedTaskIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = [...tasks];
    
    // Search: Case-insensitive search on task title and tags.
    if (searchQuery.trim()) {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(normalizedQuery) || 
        task.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    // Filter by tag
    if (tagFilter) {
      filteredTasks = filteredTasks.filter(task => task.tags.includes(tagFilter));
    }

    // Sort
    filteredTasks.sort((a, b) => {
        switch (sortOption) {
            case SortOption.TitleAZ:
                return a.title.localeCompare(b.title);
            case SortOption.TitleZA:
                return b.title.localeCompare(a.title);
            case SortOption.DateOldest:
                return a.createdAt - b.createdAt;
            case SortOption.DateNewest:
            default:
                return b.createdAt - a.createdAt;
        }
    });
    return filteredTasks;
  }, [tasks, sortOption, statusFilter, tagFilter, searchQuery]);

  // Toggles the selection of all tasks currently visible in the filtered list.
  const handleSelectAll = useCallback(() => {
    if (selectedTaskIds.size === filteredAndSortedTasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(filteredAndSortedTasks.map(t => t.id)));
    }
  }, [selectedTaskIds.size, filteredAndSortedTasks]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [tasks]);

  const handleConfirmBulkDelete = useCallback(() => {
    deleteMultipleTasks(Array.from(selectedTaskIds));
    setSelectedTaskIds(new Set());
    setIsBulkDeleteDialogOpen(false);
  }, [deleteMultipleTasks, selectedTaskIds]);


  const handleExportJSON = useCallback(() => {
    exportToJSON(tasks);
  }, [tasks]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(tasks);
  }, [tasks]);

  const isSelectionModeActive = selectedTaskIds.size > 0;
  const isAllVisibleSelected = filteredAndSortedTasks.length > 0 && selectedTaskIds.size === filteredAndSortedTasks.length;

  return (
    <div className={`min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 ${isSelectionModeActive ? 'pb-24' : ''}`}>
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onOpenTagManager={() => setIsTagManagerOpen(true)}
      />
      <main className="max-w-4xl mx-auto px-4 pb-10">
        <div className="space-y-6">
          <AddTaskForm onAddTask={addTask} />

          {tasks.length > 0 && (
            <ControlBar
              allTags={allTags}
              statusFilter={statusFilter}
              tagFilter={tagFilter}
              searchQuery={searchQuery}
              sortOption={sortOption}
              onStatusFilterChange={setStatusFilter}
              onTagFilterChange={setTagFilter}
              onSearchQueryChange={setSearchQuery}
              onSortOptionChange={setSortOption}
            />
          )}

          <TaskList
            tasks={filteredAndSortedTasks}
            totalTaskCount={tasks.length}
            onDelete={deleteTask}
            onToggleComplete={toggleTaskComplete}
            onUpdateTask={updateTask}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onStopTimer={stopTimer}
            selectedTaskIds={selectedTaskIds}
            onToggleTaskSelection={handleToggleTaskSelection}
            isSelectionModeActive={isSelectionModeActive}
          />
        </div>
      </main>
      
      {isTagManagerOpen && (
        <TagManager
          isOpen={isTagManagerOpen}
          onClose={() => setIsTagManagerOpen(false)}
          tasks={tasks}
          onRenameTag={renameTag}
          onDeleteTag={deleteTag}
        />
      )}

      {isSelectionModeActive && (
        <BulkActionBar
          selectedCount={selectedTaskIds.size}
          onSelectAll={handleSelectAll}
          onBulkDelete={() => setIsBulkDeleteDialogOpen(true)}
          isAllSelected={isAllVisibleSelected}
        />
      )}

      <ConfirmationDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Multiple Tasks"
        message={`Are you sure you want to permanently delete ${selectedTaskIds.size} selected task(s)? This action cannot be undone.`}
        confirmButtonText="Delete All"
        confirmButtonVariant="danger"
      />

      <footer className="text-center py-4 text-sm text-slate-500 dark:text-slate-400">
        <p>Built with ❤️ for simple productivity.</p>
      </footer>
    </div>
  );
};

export default App;