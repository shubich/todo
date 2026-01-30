import type { ReactNode } from 'react';
import React from 'react';

type InlineTag = 'strong' | 'em' | 'u' | 'del';

const MARKERS: [string, InlineTag][] = [
  ['**', 'strong'],   // bold
  ['__', 'u'],       // underline
  ['~~', 'del'],     // strikethrough
  ['*', 'em'],       // italic
];

function findFirstMarker(text: string): { marker: string; tag: InlineTag; start: number; end: number } | null {
  let best: { marker: string; tag: InlineTag; start: number; end: number } | null = null;
  for (const [marker, tag] of MARKERS) {
    const i = text.indexOf(marker);
    if (i === -1) continue;
    const close = text.indexOf(marker, i + marker.length);
    if (close === -1) continue;
    const end = close + marker.length;
    if (best === null || i < best.start) {
      best = { marker, tag, start: i, end };
    }
  }
  return best;
}

/** Parses inline formatting: **bold**, *italic*, __underline__, ~~strikethrough~~ */
export function formatInlineText(text: string, keyPrefix = ''): ReactNode[] {
  if (!text) return [];
  const result: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const found = findFirstMarker(remaining);
    if (found === null) {
      result.push(<span key={`${keyPrefix}-${key++}`}>{remaining}</span>);
      break;
    }

    if (found.start > 0) {
      result.push(
        <span key={`${keyPrefix}-${key++}`}>{remaining.slice(0, found.start)}</span>
      );
    }

    const inner = remaining.slice(found.start + found.marker.length, found.end - found.marker.length);
    const innerNodes = formatInlineText(inner, `${keyPrefix}-${key}`);
    const content = innerNodes.length === 1 ? innerNodes[0] : innerNodes;
    result.push(
      React.createElement(
        found.tag,
        { key: `${keyPrefix}-${key++}` },
        content
      )
    );

    remaining = remaining.slice(found.end);
  }

  return result;
}

/** Single ReactNode for a string with inline formatting */
export function formatInline(text: string, keyPrefix?: string): ReactNode {
  const nodes = formatInlineText(text, keyPrefix ?? 'inline');
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];
  return <span>{nodes}</span>;
}
