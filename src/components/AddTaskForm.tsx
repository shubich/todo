import { useState, useCallback } from 'react';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onAdd: (content: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = content.trim();
      if (trimmed) {
        onAdd(trimmed);
        setContent('');
      }
    },
    [content, onAdd]
  );

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <textarea
        className="add-task-form__input add-task-form__textarea"
        placeholder="First line = title (like iOS Notes). Add more lines and lists: - item"
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
      <button type="submit" className="add-task-form__submit" disabled={!content.trim()}>
        Add
      </button>
    </form>
  );
}
