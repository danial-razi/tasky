
import { Task } from '../types';

const downloadFile = (filename: string, content: string, mimeType: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: mimeType });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export const exportToJSON = (tasks: Task[]) => {
  const jsonString = JSON.stringify(tasks, null, 2);
  downloadFile('tasky-export.json', jsonString, 'application/json');
};

export const exportToCSV = (tasks: Task[]) => {
  const header = 'ID,Title,Tags,Status,ElapsedTime(seconds),CreatedAt,IsCompleted\n';
  const rows = tasks.map(task => 
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
