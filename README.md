# DM Grimoire

A web app built for Dungeon Masters — convert your Obsidian session notes into print-ready PDFs and track combat in real time. Upload your `.md` files, configure the layout, and get a formatted PDF ready to print. When the fight starts, use the combat tracker to manage initiative, HP, conditions and get a full combat log at the end.

## Features

### PDF Generator
- Upload one or multiple `.md` files and combine them into a single PDF
- Configurable layout: font size, letter spacing, column count, paper size, and margins
- Font selector: EB Garamond, Crimson Text, Computer Modern
- Supports Obsidian wiki-links (`[[link]]`), checkboxes, and frontmatter tags
- Filter files by frontmatter tags (e.g. only include notes tagged `active`)
- Removes unwanted sections (e.g. `images`, `map`) automatically
- Paper sizes: A4, A5, A6, and custom Binder format

### Combat Tracker
- Add combatants manually or import directly from character `.md` files
- Add multiple monsters at once — each gets a random adjective nickname (e.g. Goblin Ugly, Goblin Scarred)
- Initiative order auto-sorts as you add or edit combatants
- Track HP, Max HP, and AC — all editable inline with double-click (supports `+10`, `-5`, or absolute values)
- Condition tracking with optional round duration — auto-expires at end of turn
- Quick-pick buttons for common D&D 5e conditions
- Visual dead/unconscious state for monsters and players at 0 HP
- Keyboard shortcuts: `→` next turn, `←` previous turn
- Full combat log saved to localStorage — download as `.md` after combat ends

## Tech Stack

**Frontend:** React + TypeScript, Tailwind CSS, shadcn/ui, React Hook Form, Axios

**Backend:** Python, FastAPI, WeasyPrint, python-markdown

**Containerization:** Docker, Docker Compose

## Project Structure

```
dm-grimoire/
├── backend/
│   ├── main.py              # FastAPI app — /preview and /generate-pdf endpoints
│   ├── engine.py            # Orchestrates markdown processing and HTML generation
│   ├── processing_md.py     # Markdown preprocessing (frontmatter, Obsidian links, sections)
│   ├── html_generator.py    # HTML/CSS template builder and PDF utilities
│   ├── models.py            # Pydantic models — PreviewConfig, HtmlBuildConfig, PdfRequest
│   └── fonts/               # Bundled fonts (EB Garamond, Crimson Text, CMU Serif)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── combat-tracker.tsx        # Combat tracker root component
    │   │   ├── combatant-row.tsx         # Single combatant row with HP/conditions
    │   │   ├── combatant-form.tsx        # Add combatant form
    │   │   ├── add-condition-dialog.tsx  # Condition picker dialog
    │   │   ├── import-characters-dialog.tsx # Import from .md files
    │   │   ├── multiple-add-dialog.tsx   # Add multiple monsters dialog
    │   │   ├── preview-page.tsx          # PDF preview iframe
    │   │   └── properties.tsx            # PDF config sidebar
    │   ├── hooks/
    │   │   └── combat-log.ts             # Combat log hook (localStorage)
    │   └── utils/
    │       ├── combat-utils.ts           # Log → markdown conversion + download
    │       ├── types.ts                  # Shared TypeScript types
    │       ├── helpers.ts                # uid and other utilities
    │       └── constants.ts             # Common D&D conditions list
    └── Dockerfile
```

## Getting Started

### With Docker (recommended)

```bash
git clone https://github.com/youruser/dm-grimoire
cd dm-grimoire
docker compose up --build
```

Frontend at `http://localhost:3000` — Backend at `http://localhost:8000`.

### Manual

#### Backend

```bash
cd backend
pip install fastapi uvicorn weasyprint pypdf markdown pydantic
uvicorn main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server at `http://localhost:5173`.

## Character Template

Characters can be imported into the combat tracker from `.md` files. The filename becomes the character name. Supported frontmatter fields:

```yaml
---
hp: 40
ac: 16
tags:
  - character
  - active
---
```

## API

### `POST /preview`

Accepts multipart form data with `.md` files and a JSON config string. Returns a PDF blob.

| Field | Type | Default | Description |
|---|---|---|---|
| `title` | string | `"Preview"` | Document title shown as H1 |
| `columns` | number | `1` | Number of columns |
| `font_size` | number | `10` | Base font size in pt |
| `letter_spacing` | number | `0` | Letter spacing in pt |
| `font_family` | string | `"EB Garamond"` | Font family name |
| `paper_size` | string | `"BINDER"` | `A4`, `A5`, `A6`, or `BINDER` |
| `margin_left` | number \| null | `null` | Override left margin in mm |
| `margin_right` | number \| null | `null` | Override right margin in mm |
| `use_file_name` | boolean | `false` | Use filename as title |
| `ignored` | string[] | `[]` | Section headings to strip |
| `tags` | string[] | `[]` | Only include files with these frontmatter tags |

### `POST /generate-pdf`

Accepts a JSON body with `html` (string) and optional `filename`. Returns the rendered PDF as a download.

## Markdown Processing Pipeline

1. **Frontmatter removal** — YAML frontmatter (`---`) is stripped
2. **Tag filtering** — files without matching tags are skipped when uploading multiple files
3. **Obsidian link conversion** — `[[Link|Label]]` becomes `**_Label_**`
4. **Checkbox conversion** — `- [ ]` → ☐, `- [x]` → ☑
5. **Section removal** — headings listed in `ignored` and their content are stripped
6. **Markdown → HTML** — converted with `python-markdown` using `extra` and `sane_lists` extensions
7. **Checkbox class injection** — checkbox list items get `class="checkbox"` for CSS styling

## Combat Log Format

At the end of each combat, a `.md` file is generated and available for download. The filename is the date and time the combat started (e.g. `combat-2025-03-26_21-30.md`).

```md
### Round 1
**Ulfgar turn**
 - -5 hp to Goblin Tiny - Goblin Tiny is dead
 - Rage condition expired on Ulfgar
**Bruenor turn**
 - +4 hp to Ulfgar
**Goblin Scared turn**
 - -4 hp to Ulfgar - Ulfgar is unconscious

### Round 2
**Bruenor turn**
 - +2 hp to Ulfgar - Ulfgar is back up
 - -10 hp to Goblin Scared - Goblin Scared is dead

**End combat**
```

## Notes

- The Binder paper size (`200mm × 275mm`) has a wider left margin by default to account for ring binder holes.
- When uploading multiple files, each file becomes a section with its filename as an `##` heading.
- Combat logs are saved to `localStorage` across sessions — you can download any previous log as long as the browser data hasn't been cleared.
- Fonts are bundled in the `backend/fonts/` directory and loaded by WeasyPrint at runtime inside Docker.

