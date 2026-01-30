import { useState, useCallback } from 'react';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onAdd: (title: string) => void;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (trimmed) {
        onAdd(trimmed);
        setTitle('');
      }
    },
    [title, onAdd]
  );

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-task-form__input"
        placeholder="New task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-label="Task title"
      />
      <button type="submit" className="add-task-form__submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
}
