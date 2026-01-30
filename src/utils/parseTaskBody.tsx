import type { ReactNode } from 'react';
import { formatInline } from './formatInline';

const CHECKBOX_PREFIX = /^(\s*)(-\s+\[([ xX])\]\s)(.*)$/;
const UNORDERED_PREFIXES = /^(\s*)([-*•–—]\s)(?!\[)/;  // not followed by [
const ORDERED_PREFIX = /^(\s*)(\d+)([.)]\s)/;

export type ParsedLine =
  | { type: 'paragraph'; text: string }
  | { type: 'unordered'; indent: string; text: string; lineIndex: number }
  | { type: 'ordered'; indent: string; num: string; text: string; lineIndex: number }
  | { type: 'checkbox'; checked: boolean; text: string; lineIndex: number };

export function parseBodyLines(body: string): ParsedLine[] {
  if (!body.trim()) return [];
  const lines = body.split('\n');
  const result: ParsedLine[] = [];
  lines.forEach((line, lineIndex) => {
    const cb = line.match(CHECKBOX_PREFIX);
    if (cb) {
      result.push({
        type: 'checkbox',
        checked: cb[3].toLowerCase() === 'x',
        text: cb[4].trim(),
        lineIndex,
      });
      return;
    }
    const um = line.match(UNORDERED_PREFIXES);
    if (um) {
      result.push({
        type: 'unordered',
        indent: um[1],
        text: line.slice(um[0].length).trim(),
        lineIndex,
      });
      return;
    }
    const om = line.match(ORDERED_PREFIX);
    if (om) {
      result.push({
        type: 'ordered',
        indent: om[1],
        num: om[2],
        text: line.slice(om[0].length).trim(),
        lineIndex,
      });
      return;
    }
    result.push({ type: 'paragraph', text: line });
  });
  return result;
}

function renderText(text: string, key: string): ReactNode {
  return formatInline(text, key);
}

export interface BodyToReactOptions {
  onCheckboxToggle?: (lineIndex: number, checked: boolean) => void;
}

/** Group consecutive list items into ul/ol for rendering; checkboxes get input + label */
export function bodyToReact(
  body: string,
  options: BodyToReactOptions = {}
): ReactNode[] {
  const { onCheckboxToggle } = options;
  const parsed = parseBodyLines(body);
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < parsed.length) {
    const line = parsed[i];
    if (line.type === 'paragraph') {
      if (line.text) {
        nodes.push(
          <p key={`p-${i}`}>{renderText(line.text, `p-${i}`)}</p>
        );
      }
      i++;
      continue;
    }
    if (line.type === 'checkbox') {
      const items: ReactNode[] = [];
      while (i < parsed.length && parsed[i].type === 'checkbox') {
        const l = parsed[i] as { type: 'checkbox'; checked: boolean; text: string; lineIndex: number };
        const lineIndex = l.lineIndex;
        const id = `cb-${i}-${lineIndex}`;
        items.push(
          <li key={`cb-${i}`} className="task-content__checkbox-item">
            <input
              type="checkbox"
              id={id}
              checked={l.checked}
              onChange={() => onCheckboxToggle?.(lineIndex, !l.checked)}
              className="task-content__checkbox"
              aria-label={l.text || 'Checkbox item'}
            />
            <label htmlFor={id} className={l.checked ? 'task-content__checkbox-label--checked' : ''}>
              {renderText(l.text || ' ', `cb-${i}`)}
            </label>
          </li>
        );
        i++;
      }
      nodes.push(
        <ul key={`ul-cb-${i}`} className="task-content__list task-content__list--checkbox">
          {items}
        </ul>
      );
      continue;
    }
    if (line.type === 'unordered') {
      const items: ReactNode[] = [];
      while (i < parsed.length && parsed[i].type === 'unordered') {
        const l = parsed[i] as { type: 'unordered'; text: string };
        items.push(
          <li key={`ul-${i}`}>{renderText(l.text, `ul-${i}`)}</li>
        );
        i++;
      }
      nodes.push(<ul key={`ul-${i}`} className="task-content__list">{items}</ul>);
      continue;
    }
    if (line.type === 'ordered') {
      const items: ReactNode[] = [];
      while (i < parsed.length && parsed[i].type === 'ordered') {
        const l = parsed[i] as { type: 'ordered'; text: string };
        items.push(
          <li key={`ol-${i}`}>{renderText(l.text, `ol-${i}`)}</li>
        );
        i++;
      }
      nodes.push(<ol key={`ol-${i}`} className="task-content__list">{items}</ol>);
      continue;
    }
    i++;
  }
  return nodes;
}
