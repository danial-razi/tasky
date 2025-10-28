import { useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { useUndoableState } from './useUndoableState';

const TASKS_STORAGE_KEY = 'tasky_tasks';

export const useTasks = () => {
  // FIX: The useUndoableState hook expects an initial value, not a lazy initializer function.
  // The original code passed a function, causing a type error.
  // We now compute the initial state from localStorage once using useMemo and pass the resulting value.
  const initialTasks = useMemo(() => {
    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Error loading tasks from localStorage", error);
      return [];
    }
  }, []);

  const { 
    state: tasks, 
    setState: setTasks, 
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useUndoableState<Task[]>(initialTasks);

  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage", error);
    }
  }, [tasks]);

  const addTask = useCallback((title: string, tags: string[]) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      tags: tags.filter(tag => tag.trim() !== ''),
      status: TaskStatus.Pending,
      elapsedTime: 0,
      lastStartTime: null,
      createdAt: Date.now(),
      isCompleted: false,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  }, [setTasks]);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  }, [setTasks]);
  
  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, [setTasks]);

  const toggleTaskComplete = useCallback((id:string) => {
    setTasks(prevTasks => prevTasks.map(task => {
        if (task.id === id) {
            const isCompleted = !task.isCompleted;
            let status = task.status;
            if (isCompleted && status === TaskStatus.InProgress) {
                status = TaskStatus.Paused;
            }
            return { ...task, isCompleted, status };
        }
        return task;
    }));
  }, [setTasks]);

  const startTimer = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, status: TaskStatus.InProgress, lastStartTime: Date.now() } : task
    ));
  }, [setTasks]);

  const pauseTimer = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id && task.status === TaskStatus.InProgress && task.lastStartTime) {
        const now = Date.now();
        const elapsedSinceStart = (now - task.lastStartTime) / 1000;
        return { 
          ...task, 
          status: TaskStatus.Paused, 
          elapsedTime: task.elapsedTime + elapsedSinceStart,
          lastStartTime: null 
        };
      }
      return task;
    }));
  }, [setTasks]);

  const stopTimer = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === id) {
        let finalElapsedTime = task.elapsedTime;
        if(task.status === TaskStatus.InProgress && task.lastStartTime){
           const now = Date.now();
           const elapsedSinceStart = (now - task.lastStartTime) / 1000;
           finalElapsedTime += elapsedSinceStart;
        }
        return { 
          ...task, 
          status: TaskStatus.Pending, 
          elapsedTime: 0,
          lastStartTime: null 
        };
      }
      return task;
    }));
  }, [setTasks]);

  const renameTag = useCallback((oldTag: string, newTag: string) => {
    const trimmedNewTag = newTag.trim();
    if (!trimmedNewTag || oldTag === trimmedNewTag) return;

    setTasks(prevTasks => prevTasks.map(task => {
      if (task.tags.includes(oldTag)) {
        // Use a Set to handle cases where the new tag might already exist,
        // preventing duplicates.
        const updatedTags = new Set(task.tags.map(t => t === oldTag ? trimmedNewTag : t));
        return { ...task, tags: Array.from(updatedTags) };
      }
      return task;
    }));
  }, [setTasks]);

  const deleteTag = useCallback((tagToDelete: string) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.tags.includes(tagToDelete)) {
        return { ...task, tags: task.tags.filter(t => t !== tagToDelete) };
      }
      return task;
    }));
  }, [setTasks]);

  const deleteMultipleTasks = useCallback((ids: string[]) => {
    setTasks(prevTasks => prevTasks.filter(task => !ids.includes(task.id)));
  }, [setTasks]);

  return { tasks, addTask, deleteTask, toggleTaskComplete, startTimer, pauseTimer, stopTimer, updateTask, undo, redo, canUndo, canRedo, renameTag, deleteTag, deleteMultipleTasks };
};