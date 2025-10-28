import React, { useState, useMemo, useEffect } from 'react';
import { Task } from '../types';
import { PencilIcon, TrashIcon, CheckIcon, XCircleIcon } from './Icons';
import ConfirmationDialog from './ConfirmationDialog';

interface TagManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onRenameTag: (oldTag: string, newTag: string) => void;
  onDeleteTag: (tag: string) => void;
}

const TagManager: React.FC<TagManagerProps> = ({ isOpen, onClose, tasks, onRenameTag, onDeleteTag }) => {
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [tagToDelete, setTagToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tagUsage = useMemo(() => {
    const counts = new Map<string, number>();
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    return new Map([...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }, [tasks]);

  const allTags = useMemo(() => Array.from(tagUsage.keys()), [tagUsage]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setEditingTag(null);
    }
  }, [isOpen]);

  const handleStartEdit = (tag: string) => {
    setEditingTag(tag);
    setNewTagName(tag);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
    setError(null);
  };

  const handleSaveEdit = () => {
    if (!newTagName.trim() || newTagName.trim() === editingTag) {
      handleCancelEdit();
      return;
    }
    const trimmedNewTag = newTagName.trim();
    if (allTags.includes(trimmedNewTag)) {
      setError(`Tag "${trimmedNewTag}" already exists.`);
      return;
    }
    if (editingTag) {
      onRenameTag(editingTag, trimmedNewTag);
    }
    handleCancelEdit();
  };
  
  const handleDeleteTag = (tag: string) => {
    setTagToDelete(tag);
  };

  const handleConfirmDelete = () => {
    if (tagToDelete) {
      onDeleteTag(tagToDelete);
      setTagToDelete(null);
    }
  };


  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" aria-modal="true" role="dialog">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md m-4 max-h-[80vh] flex flex-col">
          <div className="p-4 border-b dark:border-zinc-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">Manage Tags</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700" aria-label="Close tag manager">
              <XCircleIcon className="w-6 h-6 text-slate-500" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto">
            {allTags.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No tags have been created yet.</p>
            ) : (
              <ul className="space-y-2">
                {allTags.map(tag => (
                  <li key={tag} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-800">
                    {editingTag === tag ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="flex-grow flex items-center gap-2">
                         <div className="flex-grow">
                           <input
                              type="text"
                              value={newTagName}
                              onChange={(e) => setNewTagName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Escape' && handleCancelEdit()}
                              autoFocus
                              className={`w-full p-1 border rounded-md dark:bg-zinc-700 focus:ring-1 focus:ring-sky-500 outline-none transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-zinc-600'}`}
                              aria-label={`Rename tag ${tag}`}
                              aria-invalid={!!error}
                              aria-describedby={error ? `tag-error-${tag}` : undefined}
                            />
                            {error && <p id={`tag-error-${tag}`} className="text-red-500 text-xs mt-1">{error}</p>}
                         </div>
                           <button type="submit" className="p-1 text-emerald-600 hover:text-emerald-700" aria-label="Save new tag name">
                              <CheckIcon className="w-5 h-5"/>
                          </button>
                          <button type="button" onClick={handleCancelEdit} className="p-1 text-red-600 hover:text-red-700" aria-label="Cancel renaming tag">
                              <XCircleIcon className="w-5 h-5"/>
                          </button>
                      </form>
                    ) : (
                      <>
                        <div className="flex-grow flex items-center">
                          <span className="font-medium">{tag}</span>
                          <span className="ml-2 text-xs bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 rounded-full px-2 py-0.5">
                            {tagUsage.get(tag)} {tagUsage.get(tag) === 1 ? 'task' : 'tasks'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button onClick={() => handleStartEdit(tag)} className="p-1 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400" aria-label={`Rename tag ${tag}`}>
                             <PencilIcon className="w-5 h-5"/>
                          </button>
                          <button onClick={() => handleDeleteTag(tag)} className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400" aria-label={`Delete tag ${tag}`}>
                             <TrashIcon className="w-5 h-5"/>
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 border-t dark:border-zinc-700 flex justify-end">
              <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-md hover:bg-slate-300 dark:bg-zinc-700 dark:text-slate-200 dark:hover:bg-zinc-600 transition-colors"
              >
                  Close
              </button>
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={!!tagToDelete}
        onClose={() => setTagToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Tag"
        message={
          <>
            Are you sure you want to permanently delete the tag "<strong>{tagToDelete}</strong>"? It will be removed from all associated tasks. This action cannot be undone.
          </>
        }
        confirmButtonText="Delete"
        confirmButtonVariant="danger"
      />
    </>
  );
};

export default React.memo(TagManager);