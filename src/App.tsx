import { useState, useCallback, useEffect } from 'react';
import type { Task } from './types/task';
import { COLUMNS, type ColumnId, type Priority } from './types/task';
import { loadTasks, saveTasks } from './storage';
import { AddTaskForm } from './components/AddTaskForm';
import { Column } from './components/Column';
import { TaskDetail } from './components/TaskDetail';
import './App.css';

type Theme = 'light' | 'dark';
type Language = 'ru' | 'en';
const MOBILE_BREAKPOINT = 768;

const UI_TEXT = {
  ru: {
    appTitle: 'Todo',
    themeLabel: 'Тема',
    languageLabel: 'Язык',
    themeLight: 'Светлая',
    themeDark: 'Темная',
    languageRu: 'Русский',
    languageEn: 'English',
    columns: {
      todo: 'К выполнению',
      'in-progress': 'В работе',
      done: 'Готово',
      failed: 'Провалено',
    } as Record<ColumnId, string>,
    addForm: {
      placeholder: 'Первая строка — заголовок. Ниже добавьте детали.',
      priority: 'Приоритет',
      storyPoints: 'Стори поинты',
      add: 'Добавить',
    },
    detail: {
      done: 'Готово',
      edit: 'Редактировать',
      save: 'Сохранить',
      delete: 'Удалить',
      formatting: 'Форматирование',
      checklist: 'Чек-лист: ',
      bullets: 'Пункты: ',
      numbers: 'Нумерация: ',
      contentPlaceholder: 'Первая строка — заголовок. Ниже добавьте детали.',
      priority: 'Приоритет',
      storyPoints: 'Стори поинты',
      moveTo: 'Переместить в',
    },
    mobile: {
      columns: 'Колонки',
    },
  },
  en: {
    appTitle: 'Todo',
    themeLabel: 'Theme',
    languageLabel: 'Language',
    themeLight: 'Light',
    themeDark: 'Dark',
    languageRu: 'Russian',
    languageEn: 'English',
    columns: {
      todo: 'To Do',
      'in-progress': 'In Progress',
      done: 'Done',
      failed: 'Failed',
    } as Record<ColumnId, string>,
    addForm: {
      placeholder: 'First line is the title. Add more details below.',
      priority: 'Priority',
      storyPoints: 'Story points',
      add: 'Add',
    },
    detail: {
      done: 'Done',
      edit: 'Edit',
      save: 'Save',
      delete: 'Delete',
      formatting: 'Formatting',
      checklist: 'Checklists: ',
      bullets: 'Bullets: ',
      numbers: 'Numbers: ',
      contentPlaceholder: 'First line is the title. Add more details below.',
      priority: 'Priority',
      storyPoints: 'Story points',
      moveTo: 'Move to',
    },
    mobile: {
      columns: 'Columns',
    },
  },
};

function createTask(
  content: string,
  columnId: ColumnId,
  priority: Priority,
  storyPoints: number | null,
  taskNumber: number
): Task {
  return {
    id: crypto.randomUUID(),
    content: content.trim(),
    priority,
    storyPoints,
    taskNumber,
    columnId,
    createdAt: Date.now(),
  };
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('todo-theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('todo-language');
    return saved === 'en' || saved === 'ru' ? saved : 'ru';
  });
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= MOBILE_BREAKPOINT;
  });
  const [activeMobileColumn, setActiveMobileColumn] = useState<ColumnId>('todo');

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('todo-theme', theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem('todo-language', language);
  }, [language]);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetColumnId, setDropTargetColumnId] = useState<ColumnId | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const addTask = useCallback((content: string, priority: Priority, storyPoints: number | null) => {
    setTasks((prev) => {
      const nextTaskNumber = prev.reduce((max, t) => Math.max(max, t.taskNumber), 0) + 1;
      return [...prev, createTask(content, 'todo', priority, storyPoints, nextTaskNumber)];
    });
  }, []);

  const updateTask = useCallback((taskId: string, updates: { content?: string; priority?: Priority; storyPoints?: number | null }) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          ...(updates.content !== undefined ? { content: updates.content.trim() } : {}),
          ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
          ...(updates.storyPoints !== undefined ? { storyPoints: updates.storyPoints } : {}),
        };
      })
    );
    setSelectedTask((prev) =>
      prev?.id === taskId
        ? {
            ...prev,
            ...(updates.content !== undefined ? { content: updates.content.trim() } : {}),
            ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
            ...(updates.storyPoints !== undefined ? { storyPoints: updates.storyPoints } : {}),
          }
        : prev
    );
  }, []);

  const moveTask = useCallback((taskId: string, targetColumnId: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: targetColumnId } : t))
    );
    setDraggingTaskId(null);
    setDropTargetColumnId(null);
    setSelectedTask((prev) =>
      prev?.id === taskId ? { ...prev, columnId: targetColumnId } : prev
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
  }, [selectedTask?.id]);

  const handleDragStart = useCallback((task: Task) => {
    setDraggingTaskId(task.id);
  }, []);

  const handleDrop = useCallback((taskId: string, targetColumnId: ColumnId) => {
    moveTask(taskId, targetColumnId);
  }, [moveTask]);

  const handleDragOverColumn = useCallback((columnId: ColumnId) => {
    setDropTargetColumnId(columnId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingTaskId(null);
    setDropTargetColumnId(null);
  }, []);

  const handleOpenTask = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const selectedTaskCurrent = selectedTask
    ? tasks.find((t) => t.id === selectedTask.id) ?? selectedTask
    : null;
  const t = UI_TEXT[language];
  const visibleColumns = isMobileView
    ? COLUMNS.filter((column) => column.id === activeMobileColumn)
    : COLUMNS;

  return (
    <div className="app" onDragEnd={handleDragEnd}>
      <header className="app__header">
        <div className="app__header-top">
          <h1 className="app__title">{t.appTitle}</h1>
          <div className="app__controls">
            <label className="app__control">
              {t.themeLabel}
              <select
                className="app__control-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as Theme)}
              >
                <option value="light">{t.themeLight}</option>
                <option value="dark">{t.themeDark}</option>
              </select>
            </label>
            <label className="app__control">
              {t.languageLabel}
              <select
                className="app__control-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="ru">{t.languageRu}</option>
                <option value="en">{t.languageEn}</option>
              </select>
            </label>
          </div>
        </div>
        <AddTaskForm onAdd={addTask} labels={t.addForm} />
      </header>
      {isMobileView && (
        <nav className="app__mobile-columns" aria-label={t.mobile.columns}>
          {COLUMNS.map(({ id }) => (
            <button
              key={id}
              type="button"
              className={`app__mobile-tab ${activeMobileColumn === id ? 'app__mobile-tab--active' : ''}`}
              onClick={() => setActiveMobileColumn(id)}
            >
              {t.columns[id]}
            </button>
          ))}
        </nav>
      )}
      <div className={`app__dashboard ${isMobileView ? 'app__dashboard--mobile' : ''}`}>
        {visibleColumns.map(({ id }) => (
          <Column
            key={id}
            columnId={id}
            title={t.columns[id]}
            tasks={tasks.filter((t) => t.columnId === id)}
            draggingTaskId={draggingTaskId}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOverColumn={handleDragOverColumn}
            onOpen={handleOpenTask}
            onDelete={deleteTask}
            isDropTarget={dropTargetColumnId === id}
          />
        ))}
      </div>
      {selectedTaskCurrent && (
        <TaskDetail
          task={selectedTaskCurrent}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onMove={moveTask}
          columnLabels={t.columns}
          labels={t.detail}
        />
      )}
    </div>
  );
}

export default App;
