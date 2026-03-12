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
        "margin-top": "12mm",
        "margin-bottom": "8mm",
        "margin-left": "12mm",
        "margin-right": "12mm"
    },
    "A5": {
        "size": "148mm 210mm",
        "margin-top": "12mm",
        "margin-bottom": "12mm",
        "margin-left": "12mm",
        "margin-right": "12mm"
    },
    "A6": {
        "size": "105mm 148mm",
        "margin-top": "10mm",
        "margin-bottom": "10mm",
        "margin-left": "10mm",
        "margin-right": "10mm"
    },
    "BINDER": {
        "size": "200mm 275mm",
        "margin-top": "8mm",
        "margin-bottom": "8mm",
        "margin-left": "22mm",
        "margin-right": "10mm"
    }
}


def preview_page_html(title, body, font_size, columns, paper_size):
    column_css = ""
    paper_css = f"""
    @page {{
        size: {PAPER_SIZES[paper_size]["size"]};
        margin-top: {PAPER_SIZES[paper_size]["margin-top"]};
        margin-bottom: {PAPER_SIZES[paper_size]["margin-bottom"]};
        margin-left: {PAPER_SIZES[paper_size]["margin-left"]};
        margin-right: {PAPER_SIZES[paper_size]["margin-right"]};
    }}

    .page {{
        size: {PAPER_SIZES[paper_size]["size"]};
        margin-top: {PAPER_SIZES[paper_size]["margin-top"]};
        margin-bottom: {PAPER_SIZES[paper_size]["margin-bottom"]};
        margin-left: {PAPER_SIZES[paper_size]["margin-left"]};
        margin-right: {PAPER_SIZES[paper_size]["margin-right"]};
    }}
    """

    if columns == 2:
        column_css = """
        .columns {
            column-count: 2;
            column-gap: 12px;
            column-fill: balance;
        }
        """

    css = f"""
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
{paper_css}
{css}
{column_css}
</style>
</head>

<body>
<div class="page">
<h1>{title}</h1>

<div class="columns">
{body}
</div>
</div>
</body>

</html>
"""


def build_html(title, body, font_size, columns):

    column_css = ""

    if columns == 2:
        column_css = """
        .columns {
            column-count: 2;
            column-gap: 12px;
            column-fill: balance;
        }
        """

    css = f"""
    @page {{
        size: 200mm 275mm;
        margin-top: 8mm;
        margin-bottom: 8mm;
        margin-left: 22mm;
        margin-right: 10mm;
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
