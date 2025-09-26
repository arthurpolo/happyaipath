import os
import sys
from html.parser import HTMLParser
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]

class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() != "a":
            return
        for name, value in attrs:
            if name.lower() == "href" and value:
                self.links.append(value.strip())


def is_external(href: str) -> bool:
    href_lower = href.lower()
    return any([
        href_lower.startswith(prefix)
        for prefix in ("http://", "https://", "mailto:", "tel:", "javascript:")
    ])


def main() -> int:
    html_files = sorted(REPO_ROOT.glob("*.html"))
    missing_links: dict[Path, list[str]] = {}

    for html_file in html_files:
        parser = LinkCollector()
        parser.feed(html_file.read_text(encoding="utf-8"))
        local_links = [href for href in parser.links if not is_external(href)]

        for href in local_links:
            if href.startswith("#"):
                continue
            target_path = (html_file.parent / href).resolve()
            try:
                target_path.relative_to(REPO_ROOT)
            except ValueError:
                # Link escapes repository root; flag as missing
                missing_links.setdefault(html_file, []).append(href)
                continue

            if not target_path.exists():
                missing_links.setdefault(html_file, []).append(href)

    if missing_links:
        print("Broken internal links detected:\n")
        for page, links in missing_links.items():
            print(f"- {page.relative_to(REPO_ROOT)}")
            for href in links:
                print(f"  • {href}")
        return 1

    print("All internal links resolve to existing files.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
