export type ColumnId = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  columnId: ColumnId;
  createdAt: number;
}

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];
