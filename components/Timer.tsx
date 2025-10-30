
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { formatTime } from '../utils/time';
import { PlayIcon, PauseIcon, StopIcon } from './Icons';

interface TimerProps {
  task: Task;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
}

const Timer: React.FC<TimerProps> = ({ task, onStart, onPause, onStop }) => {
  const [displayTime, setDisplayTime] = useState(task.elapsedTime);

  useEffect(() => {
    let interval: number | undefined;

    if (task.status === TaskStatus.InProgress && task.lastStartTime) {
      interval = window.setInterval(() => {
        const elapsedSinceStart = (Date.now() - (task.lastStartTime ?? 0)) / 1000;
        setDisplayTime(task.elapsedTime + elapsedSinceStart);
      }, 1000);
    } else {
      setDisplayTime(task.elapsedTime);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [task.status, task.elapsedTime, task.lastStartTime]);

  return (
    <div className="flex items-center space-x-4">
      <div className={`font-mono text-2xl md:text-3xl ${task.status === TaskStatus.InProgress ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>
        {formatTime(displayTime)}
      </div>
      <div className="flex items-center space-x-2">
        {task.status !== TaskStatus.InProgress ? (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onStart(task.id);
            }}
            disabled={task.isCompleted}
            aria-label="Start timer"
            className="p-2 rounded-full text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900 dark:hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
          >
            <PlayIcon className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={(event) => {
              event.stopPropagation();
              onPause(task.id);
            }}
            aria-label="Pause timer"
            className="p-2 rounded-full text-slate-500 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900 dark:hover:text-amber-400 transition-colors"
          >
            <PauseIcon className="w-6 h-6" />
          </button>
        )}
        <button
          onClick={(event) => {
            event.stopPropagation();
            onStop(task.id);
          }}
          aria-label="Stop and reset timer"
          className="p-2 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={task.elapsedTime === 0 && task.status !== TaskStatus.InProgress}
        >
          <StopIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
