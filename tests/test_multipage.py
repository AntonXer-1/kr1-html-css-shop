from pathlib import Path
from urllib.parse import urlsplit, unquote
import unittest
from test_site import PageParser, PROJECT_ROOT

PAGES = ("index.html", "catalog.html", "product.html", "order.html", "contacts.html")


def read_page(name):
    parser = PageParser()
    parser.feed((PROJECT_ROOT / name).read_text(encoding="utf-8"))
    return parser.elements


class MultipageTests(unittest.TestCase):
    def test_all_required_pages_exist(self):
        for name in PAGES:
            with self.subTest(page=name):
                self.assertTrue((PROJECT_ROOT / name).is_file())

    def test_pages_share_navigation_and_have_one_main(self):
        for name in PAGES:
            with self.subTest(page=name):
                self.assertTrue((PROJECT_ROOT / name).is_file())
                elements = read_page(name)
                tags = [tag for tag, _ in elements]
                self.assertEqual(tags.count("main"), 1)
                for landmark in ("header", "nav", "footer"):
                    self.assertIn(landmark, tags)
                links = {a.get("href") for tag, a in elements if tag == "a"}
                self.assertTrue(set(PAGES).issubset(links))
                self.assertEqual(sum(a.get("aria-current") == "page"
                                     for tag, a in elements if tag == "a"), 1)
                self.assertTrue(any(tag == "link" and a.get("href") == "css/style.css"
                                    for tag, a in elements))

    def test_local_links_and_images_resolve(self):
        for name in PAGES:
            self.assertTrue((PROJECT_ROOT / name).is_file())
            for tag, attrs in read_page(name):
                reference = attrs.get("href") if tag in {"a", "link"} else attrs.get("src")
                if not reference:
                    continue
                url = urlsplit(reference)
                if url.scheme or url.netloc:
                    continue
                target = PROJECT_ROOT / unquote(url.path or name)
                self.assertTrue(target.is_file(), f"{name}: {reference}")
                if url.fragment and target.suffix == ".html":
                    ids = {a.get("id") for _, a in read_page(target.name)}
                    self.assertIn(unquote(url.fragment), ids, f"{name}: {reference}")
                if tag == "img":
                    self.assertTrue(attrs.get("alt"))

    def test_product_has_characteristics_table(self):
        self.assertTrue((PROJECT_ROOT / "product.html").is_file())
        tags = [tag for tag, _ in read_page("product.html")]
        for tag in ("table", "caption", "thead", "tbody", "th", "td"):
            self.assertIn(tag, tags)
        headers = [a for tag, a in read_page("product.html") if tag == "th"]
        self.assertTrue(all(a.get("scope") in {"col", "row"} for a in headers))

    def test_order_fields_have_labels_and_validation(self):
        self.assertTrue((PROJECT_ROOT / "order.html").is_file())
        elements = read_page("order.html")
        labels = {a.get("for") for tag, a in elements if tag == "label"}
        fields = {a.get("name"): a for tag, a in elements
                  if tag in {"input", "select", "textarea"} and a.get("name")}
        for name in ("name", "email", "phone", "topic", "comment", "agreement"):
            self.assertIn(name, fields)
            self.assertIn(fields[name]["id"], labels)
        for name in ("name", "email", "phone", "topic", "agreement"):
            self.assertIn("required", fields[name])
        self.assertEqual(fields["email"]["type"], "email")
        self.assertEqual(fields["phone"]["type"], "tel")

    def test_catalog_cards_have_real_detail_destinations(self):
        self.assertTrue((PROJECT_ROOT / "catalog.html").is_file())
        detail_links = [a["href"] for tag, a in read_page("catalog.html")
                        if tag == "a" and "product-card__link" in a.get("class", "").split()]
        self.assertEqual(detail_links, ["product.html", "catalog.html#mouse-details",
                                        "catalog.html#headphones-details"])


if __name__ == "__main__":
    unittest.main()
