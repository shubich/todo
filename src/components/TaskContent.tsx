import { useCallback } from 'react';
import { getTaskTitle, getTaskBody } from '../types/task';
import { bodyToReact } from '../utils/parseTaskBody';
import { formatInline } from '../utils/formatInline';
import './TaskContent.css';

interface TaskContentProps {
  content: string;
  /** When true, render first line as header + parsed body (lists, paragraphs). When false, just show raw for edit. */
  displayMode?: boolean;
  /** When provided, checkbox toggles will update task content */
  onUpdate?: (newContent: string) => void;
}

export function TaskContent({ content, displayMode = true, onUpdate }: TaskContentProps) {
  const title = getTaskTitle(content);
  const body = getTaskBody(content);

  const handleCheckboxToggle = useCallback(
    (lineIndex: number, checked: boolean) => {
      if (!onUpdate) return;
      const lines = body.split('\n');
      const line = lines[lineIndex];
      if (!line) return;
      const newLine = checked
        ? line.replace(/\[ \]/, '[x]')
        : line.replace(/\[x\]/i, '[ ]');
      lines[lineIndex] = newLine;
      const newBody = lines.join('\n');
      const newContent = title ? `${title}\n${newBody}` : newBody;
      onUpdate(newContent.trim() ? newContent : title || newBody);
    },
    [body, title, onUpdate]
  );

  if (!displayMode) {
    return <pre className="task-content task-content--raw">{content || ' '}</pre>;
  }

  const bodyNodes = bodyToReact(body, {
    onCheckboxToggle: onUpdate ? handleCheckboxToggle : undefined,
  });

  return (
    <div className="task-content">
      <h3 className="task-content__title">
        {formatInline(title || 'Untitled', 'title')}
      </h3>
      {bodyNodes.length > 0 && (
        <div className="task-content__body">{bodyNodes}</div>
      )}
    </div>
  );
}
