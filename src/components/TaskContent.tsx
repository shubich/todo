import { getTaskTitle, getTaskBody } from '../types/task';
import { bodyToReact } from '../utils/parseTaskBody';
import './TaskContent.css';

interface TaskContentProps {
  content: string;
  /** When true, render first line as header + parsed body (lists, paragraphs). When false, just show raw for edit. */
  displayMode?: boolean;
}

export function TaskContent({ content, displayMode = true }: TaskContentProps) {
  const title = getTaskTitle(content);
  const body = getTaskBody(content);

  if (!displayMode) {
    return <pre className="task-content task-content--raw">{content || ' '}</pre>;
  }

  const bodyNodes = bodyToReact(body);

  return (
    <div className="task-content">
      <h3 className="task-content__title">{title || 'Untitled'}</h3>
      {bodyNodes.length > 0 && (
        <div className="task-content__body">{bodyNodes}</div>
      )}
    </div>
  );
}
