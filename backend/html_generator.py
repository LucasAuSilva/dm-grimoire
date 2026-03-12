import re
import tempfile

from weasyprint import HTML
from pypdf import PdfReader


def remove_empty_html_lists(html):
    html = re.sub(r"<li>\s*</li>", "", html)
    html = re.sub(r"<ul>\s*</ul>", "", html)
    return html


def fits_on_one_page(html):
    with tempfile.NamedTemporaryFile(suffix=".pdf") as tmp:
        HTML(string=html).write_pdf(tmp.name)
        reader = PdfReader(tmp.name)

        return len(reader.pages) == 1

# -----------------------------
# HTML GENERATION
# -----------------------------


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


'''
def build_html(title, body, font_size, columns):
    column_css = ""
    if columns == 2:
        column_css = """
        .columns {
            column-count: 2;
            column-gap: 16px;
            column-fill: balance;
        }
        """

    css = f"""
    @page {{
        size: 200mm 275mm;
        margin-top: 8mm;
        margin-bottom: 8mm;
        margin-right: 12mm;
        margin-left: 22mm;
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
        padding-bottom: 3px;
        margin-bottom: 8px;
    }}

    h2 {{
        font-size: {font_size + 0.6}pt;
        font-weight: bold;
        font-variant: small-caps;
        border-bottom: 1px solid #444;
        margin-top: 6px;
        margin-bottom: 2px;
    }}

    ul {{
        padding-left: 14px;
        margin-top: 2px;
        margin-bottom: 3px;
    }}

    li {{
        margin-bottom: 1px;
    }}

    p {{
        margin-top: 2px;
        margin-bottom: 3px;
    }}

    strong em {{
        text-decoration: underline;
    }}
    """

    html = f"""
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
    return html
'''
