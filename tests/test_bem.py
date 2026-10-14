import unittest
from test_multipage import PAGES, read_page


class BemComponentTests(unittest.TestCase):
    def test_shared_header_exposes_its_inner_container_and_logo(self):
        for name in PAGES:
            elements = read_page(name)
            for tag, component in (("header", "site-header"), ("div", "site-header__inner"),
                                   ("a", "site-header__logo"), ("footer", "site-footer")):
                self.assertTrue(any(t == tag and component in a.get("class", "").split()
                                    for t, a in elements), f"{name}: {component}")
            current = [a for t, a in elements if t == "a" and a.get("aria-current") == "page"]
            self.assertEqual(len(current), 1)
            self.assertIn("site-nav__link--active", current[0]["class"].split())

    def test_form_controls_expose_reusable_bem_elements(self):
        for name in ("index.html", "order.html"):
            elements = read_page(name)
            controls = [a for t, a in elements if t in ("input", "select", "textarea")
                        and a.get("type") != "hidden"]
            for attrs in controls:
                self.assertTrue(any(c.startswith("order-form__") for c in attrs.get("class", "").split()))
            labels = [a for t, a in elements if t == "label"]
            self.assertTrue(all("order-form__label" in a.get("class", "").split() for a in labels))

    def test_breadcrumbs_expose_link_and_current_elements(self):
        for name in PAGES[1:]:
            classes = {c for _, a in read_page(name) for c in a.get("class", "").split()}
            self.assertTrue({"breadcrumbs", "breadcrumbs__link", "breadcrumbs__current"} <= classes)

    def test_modifiers_are_used_with_their_base_classes(self):
        modifiers = set()
        for name in PAGES:
            for _, attrs in read_page(name):
                classes = attrs.get("class", "").split()
                self.assertNotIn("style", attrs)
                for cls in classes:
                    if "--" in cls:
                        self.assertIn(cls.split("--", 1)[0], classes)
                        modifiers.add(cls)
        self.assertTrue({"button--primary", "button--secondary", "product-card--featured",
                         "site-nav__link--active"} <= modifiers)
