
import React, { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (title: string, tags: string[]) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      onAddTask(title, tagArray);
      setTitle('');
      setTags('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What are you working on?"
        className="w-full p-3 border border-slate-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
        required
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma, separated)"
          className="flex-grow p-3 border border-slate-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
        />
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-900 transition-colors"
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default React.memo(AddTaskForm);