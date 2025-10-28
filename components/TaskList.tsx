import React from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  totalTaskCount: number;
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

const TaskList: React.FC<TaskListProps> = (props) => {
  const { tasks, totalTaskCount } = props;

  if (totalTaskCount === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No tasks yet!</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Add a new task above to get started.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No tasks match your filters.</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filter options.</p>
      </div>
    );
  }


  const completedTasks = tasks.filter(t => t.isCompleted);
  const activeTasks = tasks.filter(t => !t.isCompleted);

  return (
    <div className="space-y-4">
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          {activeTasks.map(task => (
            <TaskItem key={task.id} task={task} {...props} />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && activeTasks.length > 0 && (
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300 dark:border-zinc-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-100 dark:bg-zinc-800 px-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              Completed
            </span>
          </div>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div className="space-y-3 opacity-70">
          {completedTasks.map(task => (
            <TaskItem key={task.id} task={task} {...props} />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(TaskList);