"""Refresh crawlable blog cards from Blogger's public Atom JSON feed.

Run from the repository root: python scripts/update_blog_snapshot.py
"""

import html
import json
import re
import urllib.request
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse


FEED = "https://blog.happyaipath.com/feeds/posts/default?alt=json&max-results=10"
PAGE = Path(__file__).resolve().parents[1] / "blog.html"
START = "<!-- BLOG_POSTS_START: Static links remain visible to readers and crawlers without JavaScript. -->"
END = "<!-- BLOG_POSTS_END -->"


class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.ignored = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self.ignored += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.ignored = max(0, self.ignored - 1)

    def handle_data(self, data):
        if not self.ignored:
            self.parts.append(data)


def excerpt(markup):
    parser = PlainText()
    parser.feed(markup)
    words = re.sub(r"\s+", " ", html.unescape(" ".join(parser.parts))).strip()
    return html.escape(words[:150].rstrip() + ("…" if len(words) > 150 else ""))


def render(entry):
    url = next(link["href"] for link in entry["link"] if link["rel"] == "alternate")
    if urlparse(url).hostname != "blog.happyaipath.com":
        raise ValueError(f"Unexpected blog post URL: {url}")
    safe_url = html.escape(url, quote=True)
    title = html.escape(entry["title"]["$t"])
    published = datetime.fromisoformat(entry["published"]["$t"])
    summary = excerpt(entry.get("content", entry.get("summary", {})).get("$t", ""))
    return f'''                <article class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col">
                    <div class="p-6 flex flex-col flex-grow">
                        <time datetime="{published.date()}" class="text-sm text-gray-500 mb-2">{published.strftime('%B')} {published.day}, {published.year}</time>
                        <h3 class="text-xl font-bold mb-3 flex-grow"><a href="{safe_url}" class="text-gray-900 hover:text-[#0E7490] transition-colors duration-200">{title}</a></h3>
                        <p class="text-gray-700 mb-4">{summary}</p>
                        <a href="{safe_url}" class="font-semibold text-[#0E7490] hover:text-[#0C6880] transition-colors duration-200 mt-auto">Read More →</a>
                        <a href="{safe_url}#comments" class="mt-3 text-sm text-gray-600 hover:text-[#0E7490] hover:underline">Read or leave a comment →</a>
                    </div>
                </article>'''


def main():
    with urllib.request.urlopen(FEED, timeout=20) as response:
        entries = json.load(response)["feed"]["entry"]
    if not entries:
        raise ValueError("Blogger feed has no posts; keeping existing cards")
    page = PAGE.read_text()
    if page.count(START) != 1 or page.count(END) != 1:
        raise ValueError("Missing or duplicated blog card markers")
    cards = "\n".join(render(entry) for entry in entries)
    before, rest = page.split(START, 1)
    _, after = rest.split(END, 1)
    PAGE.write_text(before + START + "\n" + cards + "\n                " + END + after)
    print(f"Wrote {len(entries)} crawlable blog cards to {PAGE}")


if __name__ == "__main__":
    main()
