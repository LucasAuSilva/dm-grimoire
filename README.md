# MD2PDF — Markdown to Print-Ready PDF

A web app for converting Obsidian-flavored Markdown notes into clean, print-ready PDFs. Built for tabletop RPG session prep — upload your `.md` files, configure layout, and get a formatted PDF ready to print.

## Features

- Upload one or multiple `.md` files and combine them into a single PDF
- Configurable layout: font size, column count, paper size, and left margin
- Supports Obsidian wiki-links (`[[link]]`), checkboxes, and frontmatter tags
- Filter files by frontmatter tags (e.g. only include notes tagged `active`)
- Removes unwanted sections (e.g. `images`, `map`) automatically
- Paper sizes: A4, A5, A6, and custom Binder format

## Tech Stack

**Frontend:** React + TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Axios

**Backend:** Python, FastAPI, WeasyPrint, python-markdown

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app — /preview and /generate-pdf endpoints
│   ├── engine.py            # Orchestrates markdown processing and HTML generation
│   ├── processing_md.py     # Markdown preprocessing (frontmatter, Obsidian links, sections)
│   └── html_generator.py    # HTML/CSS template builder and PDF utilities
└── frontend/
    ├── preview-page.tsx     # PDF preview iframe component
    └── properties.tsx       # Sidebar form — layout config and file upload
```

## Getting Started

### Backend

```bash
pip install fastapi uvicorn weasyprint pypdf markdown
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## API

### `POST /preview`

Accepts multipart form data with `.md` files and a JSON config string. Returns a PDF blob.

**Config fields:**

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Preview"` | Document title shown as H1 |
| `columns` | number | `1` | Number of columns |
| `font_size` | number | `10` | Base font size in pt |
| `paper_size` | string | `"BINDER"` | `A4`, `A5`, `A6`, or `BINDER` |
| `margin_left` | number \| null | `null` | Override left margin in mm |
| `use_file_name` | boolean | `false` | Use filename as title |
| `ignored` | string[] | `[]` | Section headings to strip |
| `tags` | string[] | `[]` | Only include files with these frontmatter tags |

### `POST /generate-pdf`

Accepts a JSON body with `html` (string) and optional `filename`. Returns the rendered PDF as a download.

## Markdown Processing

Files go through the following pipeline before rendering:

1. **Frontmatter removal** — YAML frontmatter (`---`) is stripped
2. **Tag filtering** — files without matching tags are skipped (when multiple files are uploaded)
3. **Obsidian link conversion** — `[[Link|Label]]` becomes `**_Label_**`
4. **Checkbox conversion** — `- [ ]` → ☐, `- [x]` → ☑
5. **Section removal** — headings listed in `ignored` and their content are stripped

## Notes

- The Binder paper size (`200mm × 275mm`) has a wider left margin (`22mm`) by default to account for ring binder holes.
- When uploading multiple files, each file becomes a section with its filename as an `##` heading.
- The `use_file_name` option overrides the title field with the current file's name.

