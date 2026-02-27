import type { Task } from './types/task';
import type { ColumnId } from './types/task';
import type { Priority } from './types/task';

const STORAGE_KEY = 'todo-tasks';
const VALID_COLUMNS: ColumnId[] = ['todo', 'in-progress', 'done', 'failed'];
const VALID_PRIORITIES: Priority[] = ['high', 'medium', 'low'];

function isValidColumnId(id: string): id is ColumnId {
  return VALID_COLUMNS.includes(id as ColumnId);
}

function isValidPriority(priority: string): priority is Priority {
  return VALID_PRIORITIES.includes(priority as Priority);
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
          (typeof t.priority === 'undefined' || typeof t.priority === 'string') &&
          (typeof t.storyPoints === 'undefined' ||
            typeof t.storyPoints === 'number' ||
            t.storyPoints === null) &&
          (typeof t.taskNumber === 'undefined' || typeof t.taskNumber === 'number') &&
          typeof t.createdAt === 'number'
      )
      .map((t, idx) => ({
        ...t,
        columnId: isValidColumnId(t.columnId) ? t.columnId : 'todo',
        priority:
          typeof t.priority === 'string' && isValidPriority(t.priority)
            ? t.priority
            : 'medium',
        storyPoints:
          typeof t.storyPoints === 'number' && Number.isFinite(t.storyPoints)
            ? Math.max(0, Math.floor(t.storyPoints))
            : null,
        taskNumber:
          typeof t.taskNumber === 'number' && Number.isFinite(t.taskNumber)
            ? Math.max(1, Math.floor(t.taskNumber))
            : idx + 1,
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
