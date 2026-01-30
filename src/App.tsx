import { useState, useCallback } from 'react';
import type { Task } from './types/task';
import { COLUMNS, type ColumnId } from './types/task';
import { AddTaskForm } from './components/AddTaskForm';
import { Column } from './components/Column';
import { TaskDetail } from './components/TaskDetail';
import './App.css';

function createTask(content: string, columnId: ColumnId): Task {
  return {
    id: crypto.randomUUID(),
    content: content.trim(),
    columnId,
    createdAt: Date.now(),
  };
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetColumnId, setDropTargetColumnId] = useState<ColumnId | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const addTask = useCallback((content: string) => {
    setTasks((prev) => [...prev, createTask(content, 'todo')]);
  }, []);

  const updateTask = useCallback((taskId: string, content: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, content: content.trim() } : t))
    );
    setSelectedTask((prev) =>
      prev?.id === taskId ? { ...prev, content: content.trim() } : prev
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
