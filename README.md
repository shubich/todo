# Todo

A web app for managing tasks on a kanban-style dashboard. Create tasks with rich text (first line as title, lists, checkboxes, bold/italic/underline/strikethrough), drag them between columns, and keep everything in sync across reloads via localStorage.

## Features

- **Columns:** To Do, In Progress, Done, Failed
- **Tasks:** Multiline content; first line is the title (iOS Notes style)
- **Lists:** Bullets (`-` or `*`), numbers (`1.` or `1)`), and checklists (`- [ ]` / `- [x]`)
- **Formatting:** **bold**, *italic*, __underline__, ~~strikethrough~~
- **Drag and drop:** Move tasks between columns
- **Persistence:** All tasks are stored in `localStorage` and restored on reload

## Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Tech

- React 19 + TypeScript
- Vite 7
- CSS (no UI framework)

## Formatting (in task edit)

| Syntax        | Result        |
|---------------|---------------|
| `**text**`    | **bold**      |
| `*text*`      | *italic*      |
| `__text__`    | <u>underline</u> |
| `~~text~~`    | ~~strikethrough~~ |
| `- [ ] item`  | Unchecked checkbox |
| `- [x] item`  | Checked checkbox   |
| `- item`      | Bullet list   |
| `1. item`     | Numbered list |

First line of each task is always the title; add more lines for notes and lists.
