export enum TaskStatus {
  Pending = 'PENDING',
  InProgress = 'IN_PROGRESS',
  Paused = 'PAUSED',
}

export interface Task {
  id: string;
  title: string;
  tags: string[];
  status: TaskStatus;
  elapsedTime: number; // in seconds
  lastStartTime: number | null;
  createdAt: number;
  isCompleted: boolean;
}

export enum SortOption {
  DateNewest = 'DATE_NEWEST',
  DateOldest = 'DATE_OLDEST',
  TitleAZ = 'TITLE_AZ',
  TitleZA = 'TITLE_ZA',
}

export type FilterStatus = TaskStatus | 'ALL';
