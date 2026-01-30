import type { Task } from '../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, isDragging, onDragStart, onDelete }: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/x-task-id', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task);
  };

  return (
    <article
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
    >
      <p className="task-card__title">{task.title}</p>
      <button
        type="button"
        className="task-card__delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task: ${task.title}`}
      >
        ×
      </button>
    </article>
  );
}
