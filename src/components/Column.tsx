import type { ColumnId } from '../types/task';
import type { Task } from '../types/task';
import { TaskCard } from './TaskCard';
import './Column.css';

interface ColumnProps {
  columnId: ColumnId;
  title: string;
  tasks: Task[];
  draggingTaskId: string | null;
  onDragStart: (task: Task) => void;
  onDrop: (taskId: string, targetColumnId: ColumnId) => void;
  onDragOverColumn: (columnId: ColumnId) => void;
  onDelete: (taskId: string) => void;
  isDropTarget: boolean;
}

export function Column({
  columnId,
  title,
  tasks,
  draggingTaskId,
  onDragStart,
  onDrop,
  onDragOverColumn,
  onDelete,
  isDropTarget,
}: ColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOverColumn(columnId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('application/x-task-id');
    if (taskId) onDrop(taskId, columnId);
  };

  return (
    <section
      className={`column ${isDropTarget ? 'column--drop-target' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="column__title">{title}</h2>
      <div className="column__tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isDragging={draggingTaskId === task.id}
            onDragStart={onDragStart}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
