import React, { useState } from 'react';
import { Task } from '../types';
import Timer from './Timer';
import Tag from './Tag';
import { TrashIcon, PencilIcon } from './Icons';
import ConfirmationDialog from './ConfirmationDialog';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTask: (task: Task) => void;
  onStartTimer: (id: string) => void;
  onPauseTimer: (id: string) => void;
  onStopTimer: (id: string) => void;
  selectedTaskIds: Set<string>;
  onToggleTaskSelection: (id: string) => void;
  isSelectionModeActive: boolean;
}

const TaskItem: React.FC<TaskItemProps> = (props) => {
  const { task, onToggleComplete, onDelete, onUpdateTask, onStartTimer, onPauseTimer, onStopTimer, selectedTaskIds, onToggleTaskSelection, isSelectionModeActive } = props;
  const isSelected = selectedTaskIds.has(task.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedTags, setEditedTags] = useState(task.tags.join(', '));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [showAllTags, setShowAllTags] = useState(false);
  const TAG_DISPLAY_LIMIT = 3;
  const hasMoreTags = task.tags.length > TAG_DISPLAY_LIMIT;
  const displayedTags = showAllTags ? task.tags : task.tags.slice(0, TAG_DISPLAY_LIMIT);


  const handleSave = () => {
    if (editedTitle.trim()) {
      const tagArray = editedTags.split(',').map(tag => tag.trim()).filter(Boolean);
      onUpdateTask({
        ...task,
        title: editedTitle.trim(),
        tags: tagArray,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedTags(task.tags.join(', '));
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    setIsDeleteDialogOpen(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 shadow-sm ring-2 ring-sky-500 space-y-3">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          aria-label="Edit task title"
        />
        <input
          type="text"
          value={editedTags}
          onChange={(e) => setEditedTags(e.target.value)}
          placeholder="Tags (comma, separated)"
          className="w-full p-2 border border-slate-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
          aria-label="Edit task tags"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-md hover:bg-slate-300 dark:bg-zinc-700 dark:text-slate-200 dark:hover:bg-zinc-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-900 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        onClick={() => onToggleTaskSelection(task.id)}
        className={`p-4 rounded-lg transition-[background-color,box-shadow] duration-200 cursor-pointer ${
          isSelected 
          ? 'bg-sky-100 dark:bg-sky-900/60 ring-2 ring-sky-500' 
          : task.isCompleted 
            ? 'bg-slate-200 dark:bg-zinc-800' 
            : 'bg-white dark:bg-zinc-900 shadow-sm'
        }`}
        role="button"
        aria-pressed={isSelected}
        tabIndex={0}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-grow flex items-start gap-3">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={(e) => {
                e.stopPropagation();
                onToggleComplete(task.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              aria-label={`Mark task as complete: ${task.title}`}
            />
            <div className="flex-grow">
              <p className={`text-lg font-medium text-slate-900 dark:text-slate-100 transition-colors ${task.isCompleted && !isSelected ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>
                {task.title}
              </p>
              <div className={`mt-2 flex flex-wrap items-center gap-2 transition-opacity ${task.isCompleted && !isSelected ? 'opacity-60' : ''}`}>
                {displayedTags.map(tag => <Tag key={tag} label={tag} />)}
                {hasMoreTags && (
                  <button
                    onClick={(e) => {
                       e.stopPropagation();
                       setShowAllTags(!showAllTags);
                    }}
                    className="inline-block bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full dark:bg-zinc-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-zinc-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                  >
                    {showAllTags ? 'show less' : `+${task.tags.length - TAG_DISPLAY_LIMIT} more`}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={`flex items-center justify-between md:justify-end gap-1 pl-9 md:pl-0 transition-opacity ${isSelectionModeActive ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${task.isCompleted && !isSelected ? 'opacity-60' : ''}`}>
            <Timer task={task} onStart={onStartTimer} onPause={onPauseTimer} onStop={onStopTimer} />
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              aria-label="Edit task"
              disabled={task.isCompleted}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-100 dark:hover:bg-sky-900 dark:hover:text-sky-400 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsDeleteDialogOpen(true); }}
              aria-label="Delete task"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-red-400 rounded-full transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={
          <>
            Are you sure you want to permanently delete the task "<strong>{task.title}</strong>"? This action cannot be undone.
          </>
        }
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export default React.memo(TaskItem);