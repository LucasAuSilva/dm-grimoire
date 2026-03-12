import os
import argparse
from pathlib import Path

import markdown
from weasyprint import HTML

from processing_md import (
    preprocess,
    is_active
)

from html_generator import (
    fits_on_one_page,
    remove_empty_html_lists,
    build_html
)


def convert(default_columns, title, source_path, output_path, ignored):

    md = ""

    if os.path.isfile(source_path):
        with open(source_path, encoding="utf-8") as f:
            md = f.read()
        md = preprocess(md, ignored)
    else:
        combined_md = ""
        for file in sorted(os.listdir(source_path)):
            if not file.endswith(".md"):
                continue

            path = os.path.join(source_path, file)

            with open(path, encoding="utf-8") as f:
                file_md = f.read()

            if not is_active(file_md):
                continue

            file_md = preprocess(file_md, ignored)

            name = Path(file).stem

            combined_md += f"\n\n## {name}\n\n"
            combined_md += file_md
            combined_md += "\n\n"

        md = combined_md

    html_body = markdown.markdown(
        md,
        extensions=["extra", "sane_lists"]
    )
    html_body = remove_empty_html_lists(html_body)

    layouts = [
        (1, [10, 9.5, 9]),
        (2, [10, 9.5, 9, 8.5, 8, 7.5])
    ]

    chosen_font = None
    chosen_columns = None

    for columns, sizes in layouts:
        for size in sizes:
            html = build_html(title, html_body, size, columns)
            if fits_on_one_page(html):
                chosen_font = size
                chosen_columns = columns
                break
        if chosen_font:
            break

    '''
    for size in layouts[1]:
        html = build_html(title, html_body, size, columns=2)
        if fits_on_one_page(html):
            chosen_font = size
            break
    '''

    sizes = layouts[1][1]

    if chosen_font in sizes:
        index = sizes.index(chosen_font)
        if index + 1 < len(sizes):
            chosen_font = sizes[index + 1]

    html = build_html(title, html_body, chosen_font, chosen_columns)

    output = Path(output_path) / f"{title}.pdf"

    HTML(string=html).write_pdf(output)

    print("Generated:", output)
    print("Columns used:", chosen_columns)
    print("Font size used:", chosen_font)


parser = argparse.ArgumentParser()

parser.add_argument(
    "source_path",
    help="Source that will be converted to printable PDF,"
    + " can be an single File or Path with multiple .MD")
parser.add_argument(
    "output_path",
    help="Output path/folder that will be write the PDF")
parser.add_argument(
    "-t",
    "--title",
    action="store",
    help="Title of the single page and filename on the output"
    + ", if doesn't pass this the folder/file name will be used")
parser.add_argument(
    "-i",
    "--ignore",
    nargs="*",
    help="List of sections that will be ignored by the generator,"
    + " need to match name on .MD")

args = parser.parse_args()

if __name__ == "__main__":

    source_path = args.source_path
    output_path = args.output_path

    if source_path is None or output_path is None:
        print("Either one of the required arguments doesn't came")
        raise SystemExit(1)

    if args.title is not None:
        title = args.title
    else:
        title = os.path.splitext(os.path.basename(source_path))[0]

    convert(1, title, source_path, output_path, args.ignore)
