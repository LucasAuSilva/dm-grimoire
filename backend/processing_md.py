
import re


def preprocess(md, ignored=[]):

    if ignored is None:
        ignore = []
    else:
        ignore = ignored

    md = remove_frontmatter(md)
    md = fix_obsidian_links(md)
    md = fix_checkboxes(md)
    md = remove_sections(md, ["image", "images/map", "images", *ignore])

    return md


def get_frontmatter(md):
    match = re.search(r"^---(.*?)---", md, re.S)
    if not match:
        return ""

    return match.group(1)


def is_active(md, tags=[]):

    include_tags = ["active", *tags]

    frontmatter = get_frontmatter(md)
    if not frontmatter:
        return False
    tags_block = re.search(r"tags:\s*(.*?)(\n\S|$)", frontmatter, re.S)

    if not tags_block:
        return False
    tags = re.findall(r"-\s*(\w+)", tags_block.group(1))

    return set(tags) & set(include_tags)


def remove_frontmatter(md):
    return re.sub(r"^---.*?---\n", "", md, flags=re.S)


def fix_obsidian_links(md):

    def replace(match):
        content = match.group(1)
        if "#" in content:
            content = content.split("#")[0]
        if "|" in content:
            label = content.split("|")[1]
        else:
            label = content
        return f"**_{label}_**"

    return re.sub(r"\[\[(.*?)\]\]", replace, md)


def fix_checkboxes(md):
    md = md.replace("- [ ]", "- ☐")
    md = md.replace("- [x]", "- ☑")
    return md


def remove_sections(md, ignored):

    if not ignored:
        return md

    lines = md.splitlines()
    result = []
    skip = False

    for line in lines:
        heading = re.match(r"^#+\s*(.*)", line.lower())
        if heading:
            title = heading.group(1).strip()

            if title in ignored:
                skip = True
                continue
            else:
                skip = False
        if not skip:
            result.append(line)

    return "\n".join(result)
