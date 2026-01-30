import type { Task } from './types/task';
import type { ColumnId } from './types/task';

const STORAGE_KEY = 'todo-tasks';
const VALID_COLUMNS: ColumnId[] = ['todo', 'in-progress', 'done', 'failed'];

function isValidColumnId(id: string): id is ColumnId {
  return VALID_COLUMNS.includes(id as ColumnId);
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (t): t is Task =>
          t != null &&
          typeof t === 'object' &&
          typeof t.id === 'string' &&
          typeof t.content === 'string' &&
          typeof t.columnId === 'string' &&
          typeof t.createdAt === 'number'
      )
      .map((t) => ({
        ...t,
        columnId: isValidColumnId(t.columnId) ? t.columnId : 'todo',
      }));
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore quota / private mode errors
  }
}
