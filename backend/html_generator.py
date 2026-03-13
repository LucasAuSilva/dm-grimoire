import re
import tempfile

from weasyprint import HTML
from pypdf import PdfReader


def remove_empty_html_lists(html):
    html = re.sub(r"<li>\s*</li>", "", html)
    html = re.sub(r"<ul>\s*</ul>", "", html)
    return html


def fits_in_pages(html, page_numbers):
    with tempfile.NamedTemporaryFile(suffix=".pdf") as tmp:
        HTML(string=html).write_pdf(tmp.name)
        reader = PdfReader(tmp.name)
        return len(reader.pages) <= page_numbers


PAPER_SIZES = {
    "A4": {
        "size": "210mm 297mm",
        "margin-top": "6mm",
        "margin-bottom": "6mm",
        "margin-left": "6mm",
        "margin-right": "6mm"
    },
    "A5": {
        "size": "148mm 210mm",
        "margin-top": "4mm",
        "margin-bottom": "4mm",
        "margin-left": "4mm",
        "margin-right": "4mm"
    },
    "A6": {
        "size": "105mm 148mm",
        "margin-top": "2mm",
        "margin-bottom": "2mm",
        "margin-left": "2mm",
        "margin-right": "2mm"
    },
    "BINDER": {
        "size": "200mm 275mm",
        "margin-top": "6mm",
        "margin-bottom": "6mm",
        "margin-left": "22mm",
        "margin-right": "6mm"
    }
}


def build_html(title, body, font_size, columns, paper_size, margin_left):

    column_css = ""

    margin_left_css = PAPER_SIZES[paper_size]["margin-left"]

    if margin_left != "":
        margin_left_css = str(margin_left) + "mm"

    if columns >= 2:
        column_css = f"""
        .columns {{
            column-count: {columns};
            column-gap: 10px;
            column-fill: auto;
        }}
        """

    css = f"""
    @page {{
        size: {PAPER_SIZES[paper_size]["size"]};
        margin-top: {PAPER_SIZES[paper_size]["margin-top"]};
        margin-bottom: {PAPER_SIZES[paper_size]["margin-bottom"]};
        margin-left: {margin_left_css};
        margin-right: {PAPER_SIZES[paper_size]["margin-right"]};
    }}

    body {{
        font-family: Georgia, serif;
        font-size: {font_size}pt;
        line-height: 1.15;
    }}

    h1 {{
        font-size: {font_size + 4}pt;
        text-align: center;
        border-bottom: 2px solid black;
        margin-bottom: 8px;
    }}

    h2 {{
        font-size: {font_size + 0.6}pt;
        font-variant: small-caps;
        border-bottom: 1px solid #444;
        margin-top: 6px;
    }}

    h3 {{
        font-size: {font_size + 0.3}pt;
        font-variant: small-caps;
        margin-top: 6px;
    }}

    p {{
        margin-top: 2px;
        margin-bottom: 4px;
    }}

    li {{
        margin-bottom: 1px;
    }}
    """

    return f"""
<html>
<head>
<meta charset="utf-8">
<style>
{css}
{column_css}
</style>
</head>

<body>

<h1>{title}</h1>

<div class="columns">
{body}
</div>

</body>
</html>
"""
