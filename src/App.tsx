import { useState, useCallback, useEffect } from 'react';
import type { Task } from './types/task';
import { COLUMNS, type ColumnId, type Priority } from './types/task';
import { loadTasks, saveTasks } from './storage';
import { AddTaskForm } from './components/AddTaskForm';
import { Column } from './components/Column';
import { TaskDetail } from './components/TaskDetail';
import './App.css';

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

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);
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

  return (
    <div className="app" onDragEnd={handleDragEnd}>
      <header className="app__header">
        <h1 className="app__title">Todo</h1>
        <AddTaskForm onAdd={addTask} />
      </header>
      <div className="app__dashboard">
        {COLUMNS.map(({ id, label }) => (
          <Column
            key={id}
            columnId={id}
            title={label}
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
        />
      )}
    </div>
  );
}

export default App;
