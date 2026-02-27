import type { Task } from '../types/task';
import { getTaskBody, getTaskTitle } from '../types/task';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onDragStart: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onOpen: (task: Task) => void;
}

export function TaskCard({ task, isDragging, onDragStart, onDelete, onOpen }: TaskCardProps) {
  const title = getTaskTitle(task.content);
  const body = getTaskBody(task.content);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/x-task-id', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.task-card__delete')) return;
    onOpen(task);
  };

  return (
    <article
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <div className="task-card__main">
        <p className="task-card__title">{title || 'Untitled'}</p>
        {body && <p className="task-card__body">{body}</p>}
      </div>
      <button
        type="button"
        className="task-card__delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        aria-label={`Delete task: ${title}`}
      >
        ×
      </button>
    </article>
  );
}
