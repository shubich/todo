import { useState, useCallback, useEffect } from 'react';
import { PRIORITIES, type Priority, type Task } from '../types/task';
import { TaskContent } from './TaskContent';
import './TaskDetail.css';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (
    taskId: string,
    updates: { content?: string; priority?: Priority; storyPoints?: number | null }
  ) => void;
  onDelete: (taskId: string) => void;
  labels: {
    done: string;
    edit: string;
    save: string;
    delete: string;
    formatting: string;
    checklist: string;
    bullets: string;
    numbers: string;
    contentPlaceholder: string;
    priority: string;
    storyPoints: string;
  };
}

export function TaskDetail({ task, onClose, onUpdate, onDelete, labels }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editStoryPoints, setEditStoryPoints] = useState<string>(
    task.storyPoints === null ? '' : String(task.storyPoints)
  );

  useEffect(() => {
    setEditContent(task.content);
    setEditPriority(task.priority);
    setEditStoryPoints(task.storyPoints === null ? '' : String(task.storyPoints));
  }, [task.id, task.content, task.priority, task.storyPoints]);

  const handleSave = useCallback(() => {
    const trimmed = editContent.trim();
    if (trimmed) {
      const parsedPoints = editStoryPoints.trim() === '' ? null : Number(editStoryPoints);
      const normalizedPoints =
        parsedPoints === null || Number.isNaN(parsedPoints)
          ? null
          : Math.max(0, Math.floor(parsedPoints));
      onUpdate(task.id, {
        content: trimmed,
        priority: editPriority,
        storyPoints: normalizedPoints,
      });
    }
    setIsEditing(false);
  }, [task.id, editContent, editPriority, editStoryPoints, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setEditContent(task.content);
          setEditPriority(task.priority);
          setEditStoryPoints(task.storyPoints === null ? '' : String(task.storyPoints));
          setIsEditing(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'Enter' && e.metaKey) {
        handleSave();
      }
    },
    [isEditing, task.content, task.priority, task.storyPoints, onClose, handleSave]
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
            {labels.done}
          </button>
          <div className="task-detail__actions">
            <button
              type="button"
              className="task-detail__action"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            >
              {isEditing ? labels.save : labels.edit}
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
              {labels.delete}
            </button>
          </div>
        </div>
        <div className="task-detail__content">
          {isEditing ? (
            <>
              <div className="task-detail__instructions">
                <p className="task-detail__instructions-title">{labels.formatting}</p>
                <ul className="task-detail__instructions-list">
                  <li><strong>**bold**</strong> <em>*italic*</em> <u>__underline__</u> <del>~~strikethrough~~</del></li>
                  <li>{labels.checklist}<code>- [ ]</code>, <code>- [x]</code></li>
                  <li>{labels.bullets}<code>- item</code>, <code>* item</code></li>
                  <li>{labels.numbers}<code>1. item</code>, <code>1) item</code></li>
                </ul>
              </div>
              <div className="task-detail__edit-meta">
                <label className="task-detail__priority-label">
                  {labels.priority}
                  <select
                    className="task-detail__priority"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="task-detail__priority-label">
                  {labels.storyPoints}
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className="task-detail__priority"
                    value={editStoryPoints}
                    onChange={(e) => setEditStoryPoints(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </label>
              </div>
              <textarea
                id="task-detail-title"
                className="task-detail__textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder={labels.contentPlaceholder}
                autoFocus
                rows={12}
              />
            </>
          ) : (
            <TaskContent
              content={task.content}
              displayMode
              onUpdate={(newContent) => onUpdate(task.id, { content: newContent })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
