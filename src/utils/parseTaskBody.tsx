import type { ReactNode } from 'react';

const UNORDERED_PREFIXES = /^(\s*)([-*•–—]\s)/;
const ORDERED_PREFIX = /^(\s*)(\d+)([.)]\s)/;

export type ParsedLine =
  | { type: 'paragraph'; text: string }
  | { type: 'unordered'; indent: string; text: string }
  | { type: 'ordered'; indent: string; num: string; text: string };

export function parseBodyLines(body: string): ParsedLine[] {
  if (!body.trim()) return [];
  const lines = body.split('\n');
  const result: ParsedLine[] = [];
  for (const line of lines) {
    const um = line.match(UNORDERED_PREFIXES);
    if (um) {
      result.push({ type: 'unordered', indent: um[1], text: line.slice(um[0].length).trim() });
      continue;
    }
    const om = line.match(ORDERED_PREFIX);
    if (om) {
      result.push({
        type: 'ordered',
        indent: om[1],
        num: om[2],
        text: line.slice(om[0].length).trim(),
      });
      continue;
    }
    result.push({ type: 'paragraph', text: line });
  }
  return result;
}

/** Group consecutive list items into ul/ol for rendering */
export function bodyToReact(body: string): ReactNode[] {
  const parsed = parseBodyLines(body);
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < parsed.length) {
    const line = parsed[i];
    if (line.type === 'paragraph') {
      if (line.text) nodes.push(<p key={i}>{line.text}</p>);
      i++;
      continue;
    }
    if (line.type === 'unordered') {
      const items: ReactNode[] = [];
      while (i < parsed.length && parsed[i].type === 'unordered') {
        const l = parsed[i] as { type: 'unordered'; text: string };
        items.push(<li key={i}>{l.text}</li>);
        i++;
      }
      nodes.push(<ul key={i}>{items}</ul>);
      continue;
    }
    if (line.type === 'ordered') {
      const items: ReactNode[] = [];
      while (i < parsed.length && parsed[i].type === 'ordered') {
        const l = parsed[i] as { type: 'ordered'; text: string };
        items.push(<li key={i}>{l.text}</li>);
        i++;
      }
      nodes.push(<ol key={i}>{items}</ol>);
      continue;
    }
    i++;
  }
  return nodes;
}
