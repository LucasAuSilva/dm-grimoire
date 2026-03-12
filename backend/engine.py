import markdown

from processing_md import preprocess, is_active
from html_generator import (
    build_html,
    remove_empty_html_lists
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
    ignored = config.get("ignored", [])
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
    html = build_html(title, html_body, font_size, columns, paper_size)

    return {
        "html": html
    }
