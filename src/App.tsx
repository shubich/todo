import { useState, useCallback } from 'react';
import type { Task } from './types/task';
import { COLUMNS, type ColumnId } from './types/task';
import { AddTaskForm } from './components/AddTaskForm';
import { Column } from './components/Column';
import './App.css';

function createTask(title: string, columnId: ColumnId): Task {
  return {
    id: crypto.randomUUID(),
    title,
    columnId,
    createdAt: Date.now(),
  };
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetColumnId, setDropTargetColumnId] = useState<ColumnId | null>(null);

  const addTask = useCallback((title: string) => {
    setTasks((prev) => [...prev, createTask(title, 'todo')]);
  }, []);

  const moveTask = useCallback((taskId: string, targetColumnId: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: targetColumnId } : t))
    );
    setDraggingTaskId(null);
    setDropTargetColumnId(null);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

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
            onDelete={deleteTask}
            isDropTarget={dropTargetColumnId === id}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
