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
        "margin-top": "8mm",
        "margin-bottom": "8mm",
        "margin-left": "8mm",
        "margin-right": "8mm"
    },
    "A5": {
        "size": "148mm 210mm",
        "margin-top": "3mm",
        "margin-bottom": "8mm",
        "margin-left": "6mm",
        "margin-right": "6mm"
    },
    "A6": {
        "size": "105mm 148mm",
        "margin-top": "4mm",
        "margin-bottom": "4mm",
        "margin-left": "4mm",
        "margin-right": "4mm"
    },
    "BINDER": {
        "size": "200mm 275mm",
        "margin-top": "8mm",
        "margin-bottom": "8mm",
        "margin-left": "12mm",
        "margin-right": "8mm"
    }
}


def build_html(title, body, font_size, columns, paper_size, margin_left):

    column_css = ""

    margin_left_css = PAPER_SIZES[paper_size]["margin-left"]

    if margin_left is not None:
        margin_left_css = str(margin_left) + "mm"

    if columns >= 2:
        column_css = f"""
        .columns {{
            column-count: {columns};
            column-gap: 10px;
            column-fill: auto;
        }}
        """

    print("font_size: ", font_size)

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
        font-stretch: condensed;
        letter-spacing: -0.4pt;
    }}

    h1 {{
        font-size: {font_size + 2}pt;
        text-align: center;
        border-bottom: 2px solid black;
        margin-bottom: 4px;
    }}

    h2 {{
        font-size: {font_size + 0.6}pt;
        font-variant: small-caps;
        border-bottom: 1px solid #444;
        margin-top: 3px;
    }}

    h3 {{
        font-size: {font_size + 0.3}pt;
        font-variant: small-caps;
        margin-top: 3px;
    }}

    p {{
        margin-top: 1px;
        margin-bottom: 1px;
    }}

    ul {{
        padding-left: 8px;
        list-style-position: inside;
    }}

    li {{
        margin-bottom: 1px;
    }}

    li.checkbox {{
        list-style: none;
        margin-left: -8px;
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
