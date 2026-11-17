#!/usr/bin/env python3
"""Build the screenshot report PDF (requires markdown, pypdf, and Chrome).

Example: python scripts/build-improvement-report.py
Set CHROME_PATH when Chrome is not installed in the default macOS location.
"""

import os
import re
from pathlib import Path
import subprocess
import tempfile

import markdown
from pypdf import PdfWriter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/course-chatbot-improvement-report.md"
OUTPUT = SOURCE.with_suffix(".pdf")
EVIDENCE = ROOT / "reports/chatbot-improvement"

CSS = """
@page { size: Letter; margin: 0.55in 0.6in 0.6in;
  @bottom-right { content: counter(page); font: 8pt Arial; color: #637086; }
}
body { font: 9.5pt/1.32 Arial, sans-serif; color: #202c3c; }
h1 { font-size: 22pt; line-height: 1.1; margin: 0 0 10pt; color: #183d5c; }
h2 { font-size: 13pt; margin: 13pt 0 6pt; color: #183d5c; }
h3 { font-size: 11pt; margin: 10pt 0 6pt; color: #183d5c; }
h1,h2,h3 { break-after: avoid; }
p { margin: 5pt 0; orphans: 3; widows: 3; }
ol { margin: 5pt 0; padding-left: 20pt; }
a { color: #225d85; text-decoration: none; overflow-wrap: anywhere; }
code { font: 8.4pt Menlo, monospace; }
pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f1f5f8;
  border-left: 2pt solid #8ea8ba; padding: 6pt 8pt; margin: 6pt 0;
  break-inside: avoid; }
pre code { font: 9.1pt/1.32 Arial, sans-serif; }
table { width: 100%; border-collapse: collapse; margin: 7pt 0; font-size: 8.7pt; }
th,td { border: 1px solid #c5d2dc; padding: 5pt 6pt; text-align: left; }
th { background: #edf3f7; }
tr { break-inside: avoid; }
thead { display: table-header-group; }
.evidence { margin: 8pt auto; text-align: center; break-inside: avoid; }
.evidence img { display: block; max-width: 100%; max-height: 4.6in; width: auto; margin: auto; }
.evidence figcaption { font-size: 8pt; color: #51657b; margin-top: 4pt; }
.screenshot-pair { display: flex; gap: 12pt; align-items: flex-start; break-inside: avoid; }
.screenshot-pair .evidence { flex: 1; min-width: 0; }
.screenshot-pair img { max-height: 4.6in; }
.new-page { break-before: page; }
.test-with-image { display: grid; grid-template-columns: minmax(0,1fr) 2.7in;
  gap: 14pt; align-items: start; break-inside: avoid; }
.test-with-image .evidence { margin-top: 4pt; }
.before-after img { max-height: 6.3in; }
"""


def main():
    body = markdown.markdown(SOURCE.read_text(), extensions=["tables", "fenced_code"])
    for heading in [
        "Part 3 — New Feature: Short / Detailed Answers",
        "F2 — Detailed Project Explanation",
        "F3 — Detailed Mode With Private Information",
    ]:
        for level in ["h2", "h3"]:
            body = body.replace(f"<{level}>{heading}</{level}>", f'<{level} class="new-page">{heading}</{level}>')

    # Place the shorter test descriptions alongside their screenshots. Keep
    # TRACE's longer detailed response above its two supporting screenshots.
    for identifier in ["F1 — Short Research Summary", "F3 — Detailed Mode With Private Information"]:
        pattern = rf'(<h3(?: class="new-page")?>{re.escape(identifier)}</h3>)(.*?)(<figure class="evidence">.*?</figure>)'
        body = re.sub(pattern, lambda match: match[1] + '<section class="test-with-image"><div>' + match[2] + '</div>' + match[3] + '</section>', body, flags=re.S)
    body = body.replace('<div class="screenshot-pair">', '<h3>Before and after screenshots</h3><div class="screenshot-pair before-after">', 1)

    chrome = os.environ.get("CHROME_PATH", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    with tempfile.TemporaryDirectory(prefix="academic-improvement-pdf-") as temporary:
        working = Path(temporary)
        html = working / "report.html"
        html.write_text(
            '<!doctype html><html><head><meta charset="utf-8">'
            '<title>Chatbot Improvement Report — Mingyang Jiang</title>'
            f'<base href="{SOURCE.parent.as_uri()}/"><style>{CSS}</style>'
            f"</head><body>{body}</body></html>"
        )
        subprocess.run(
            [chrome, "--headless", "--disable-gpu", "--no-pdf-header-footer",
             f"--user-data-dir={working / 'chrome-profile'}",
             f"--print-to-pdf={OUTPUT}", html.as_uri()],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        writer = PdfWriter(clone_from=str(OUTPUT))
        for name in ["before.jsonl", "after.jsonl", "review-log.jsonl", "regression.jsonl", "standard-mode-check.jsonl", "verification.json", "production-smoke.json", "public-verification.jsonl", "deployment.json"]:
            writer.add_attachment(name, (EVIDENCE / name).read_bytes())
        writer.add_metadata({"/Title": "Chatbot Improvement Report", "/Author": "Mingyang Jiang"})
        complete = working / "complete.pdf"
        with complete.open("wb") as stream:
            writer.write(stream)
        OUTPUT.write_bytes(complete.read_bytes())
    print(f"Created {OUTPUT}")


if __name__ == "__main__":
    main()
