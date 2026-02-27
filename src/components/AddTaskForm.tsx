import { useState, useCallback } from 'react';
import { PRIORITIES, type Priority } from '../types/task';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onAdd: (content: string, priority: Priority, storyPoints: number | null) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [storyPoints, setStoryPoints] = useState<string>('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = content.trim();
      if (trimmed) {
        const parsedPoints = storyPoints.trim() === '' ? null : Number(storyPoints);
        const normalizedPoints =
          parsedPoints === null || Number.isNaN(parsedPoints)
            ? null
            : Math.max(0, Math.floor(parsedPoints));
        onAdd(trimmed, priority, normalizedPoints);
        setContent('');
        setPriority('medium');
        setStoryPoints('');
      }
    },
    [content, priority, storyPoints, onAdd]
  );

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <textarea
        className="add-task-form__input add-task-form__textarea"
        placeholder="First line is the title. Add more lines below."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        aria-label="Task content (first line = title)"
        rows={2}
      />
      <div className="add-task-form__controls">
        <label className="add-task-form__priority-label">
          Priority
          <select
            className="add-task-form__priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-label="Task priority"
          >
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="add-task-form__priority-label">
          Story points
          <input
            type="number"
            min={0}
            step={1}
            className="add-task-form__priority"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
            placeholder="e.g. 3"
            aria-label="Story points"
          />
        </label>
        <button type="submit" className="add-task-form__submit" disabled={!content.trim()}>
          Add
        </button>
      </div>
    </form>
  );
}
