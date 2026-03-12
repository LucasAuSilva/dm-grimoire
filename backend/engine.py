import markdown

from processing_md import preprocess, is_active
from html_generator import (
    fits_in_pages,
    remove_empty_html_lists,
    preview_page_html,
)


def preview_html(md_files, config):
    """
    md_files: list of dicts
        [
            {"name": "npc1", "content": "...markdown..."},
            {"name": "npc2", "content": "...markdown..."}
        ]

    config: {
        title: str,
        columns: int,
        font_size: float,
        ignore: list[str]
    }
    """

    title = config.get("title", "Preview")
    columns = int(config.get("columns", 1))
    font_size = int(config.get("font_size", 10))
    ignored = config.get("ignore", [])
    paper_size = config.get("paper_size", "BINDER")

    combined_md = ""

    for file in md_files:
        md = file["content"]
        if not is_active(md) and len(md_files) != 1:
            continue

        if len(md_files) == 1:
            title = file["name"]

        md = preprocess(md, ignored)

        if len(md_files) > 1:
            name = file["name"]
            combined_md += f"\n\n## {name}\n\n"
        combined_md += md
        combined_md += "\n\n"

    html_body = markdown.markdown(
        combined_md,
        extensions=["extra", "sane_lists"]
    )

    html_body = remove_empty_html_lists(html_body)
    html = preview_page_html(title, html_body, font_size, columns, paper_size)

    if not fits_in_pages(html, 1):
        return {
            "error": "Font size too large for the selected paper size/page numbers"
        }

    return {
        "html": html
    }

    return {
        "html": html,
        "meta": {
            "columns": columns,
            "font_size": font_size,
            "files_processed": len(md_files)
        }
    }
