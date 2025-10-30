
import { Task, TaskStatus } from '../types';

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

const withLiveElapsedTime = (tasks: Task[]): Task[] => {
  const now = Date.now();

  return tasks.map(task => {
    if (task.status === TaskStatus.InProgress && task.lastStartTime) {
      const liveElapsedSeconds = (now - task.lastStartTime) / 1000;
      return {
        ...task,
        elapsedTime: task.elapsedTime + liveElapsedSeconds,
      };
    }
    return task;
  });
};

export const exportToJSON = (tasks: Task[]) => {
  const tasksWithLiveElapsed = withLiveElapsedTime(tasks);
  const jsonString = JSON.stringify(tasksWithLiveElapsed, null, 2);
  downloadFile('tasky-export.json', jsonString, 'application/json');
};

export const exportToCSV = (tasks: Task[]) => {
  const tasksWithLiveElapsed = withLiveElapsedTime(tasks);
  const header = 'ID,Title,Tags,Status,ElapsedTime(seconds),CreatedAt,IsCompleted\n';
  const rows = tasksWithLiveElapsed.map(task => 
    [
      task.id,
      `"${task.title.replace(/"/g, '""')}"`,
      `"${task.tags.join('|')}"`,
      task.status,
      task.elapsedTime,
      new Date(task.createdAt).toISOString(),
      task.isCompleted
    ].join(',')
  ).join('\n');
  
  const csvContent = header + rows;
  downloadFile('tasky-export.csv', csvContent, 'text/csv');
};
