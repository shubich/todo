import { useState, useCallback, useEffect } from 'react';
import type { Task } from '../types/task';
import { TaskContent } from './TaskContent';
import './TaskDetail.css';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (taskId: string, content: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetail({ task, onClose, onUpdate, onDelete }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  useEffect(() => {
    setEditContent(task.content);
  }, [task.id, task.content]);

  const handleSave = useCallback(() => {
    const trimmed = editContent.trim();
    if (trimmed) {
      onUpdate(task.id, trimmed);
    }
    setIsEditing(false);
  }, [task.id, editContent, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setEditContent(task.content);
          setIsEditing(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'Enter' && e.metaKey) {
        handleSave();
      }
    },
    [isEditing, task.content, onClose, handleSave]
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (isEditing) handleSave();
      onClose();
    }
  };

  return (
    <div
      className="task-detail-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <div className="task-detail">
        <div className="task-detail__toolbar">
          <button
            type="button"
            className="task-detail__close"
            onClick={onClose}
            aria-label="Close"
          >
            Done
          </button>
          <div className="task-detail__actions">
            <button
              type="button"
              className="task-detail__action"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button
              type="button"
              className="task-detail__action task-detail__action--danger"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              aria-label="Delete task"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="task-detail__content">
          {isEditing ? (
            <textarea
              id="task-detail-title"
              className="task-detail__textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder={'First line = title (like iOS Notes)\nThen add notes or lists:\n- [ ] unchecked item\n- [x] checked item\n**bold** *italic* __underline__ ~~strike~~\n1. step one\n2. step two'}
              autoFocus
              rows={12}
            />
          ) : (
            <TaskContent
              content={task.content}
              displayMode
              onUpdate={(newContent) => onUpdate(task.id, newContent)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
