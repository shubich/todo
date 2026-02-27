export type ColumnId = 'todo' | 'in-progress' | 'done' | 'failed';
export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  /** Full multiline content: first line = header (iOS Notes style), rest = body with optional lists */
  content: string;
  priority: Priority;
  storyPoints: number | null;
  taskNumber: number;
  columnId: ColumnId;
  createdAt: number;
}

export const PRIORITIES: { id: Priority; label: string }[] = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

/** First line of content used as task title in cards and headers */
export function getTaskTitle(content: string): string {
  const first = content.trim().split('\n')[0]?.trim();
  return first ?? 'Untitled';
}

/** Body = everything after the first line */
export function getTaskBody(content: string): string {
  const lines = content.trim().split('\n');
  if (lines.length <= 1) return '';
  return lines.slice(1).join('\n').trim();
}

export const COLUMNS: { id: ColumnId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
  { id: 'failed', label: 'Failed' },
];
