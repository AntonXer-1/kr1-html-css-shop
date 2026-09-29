from html.parser import HTMLParser
from pathlib import Path
import unittest


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))


def parse_index():
    parser = PageParser()
    parser.feed((PROJECT_ROOT / "index.html").read_text(encoding="utf-8"))
    return parser.elements


class SemanticPageTests(unittest.TestCase):
    def test_page_exposes_the_required_semantic_landmarks(self):
        elements = parse_index()
        tags = [tag for tag, _ in elements]

        self.assertIn("header", tags)
        self.assertIn("nav", tags)
        self.assertEqual(tags.count("main"), 1)
        self.assertIn("aside", tags)
        self.assertIn("footer", tags)

    def test_navigation_targets_existing_page_sections(self):
        elements = parse_index()
        ids = {attrs["id"] for _, attrs in elements if "id" in attrs}
        links = {
            attrs["href"]
            for tag, attrs in elements
            if tag == "a" and attrs.get("href", "").startswith("#")
        }

        self.assertTrue({"#popular", "#advantages", "#contacts"}.issubset(links))
        self.assertTrue({"popular", "advantages", "contacts"}.issubset(ids))

    def test_popular_section_contains_three_product_cards(self):
        elements = parse_index()
        product_cards = [
            attrs
            for tag, attrs in elements
            if tag == "article" and "product-card" in attrs.get("class", "").split()
        ]

        self.assertEqual(len(product_cards), 3)


if __name__ == "__main__":
    unittest.main()
