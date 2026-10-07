import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true });
after(() => browser.close());
const pages = ['index.html', 'catalog.html', 'product.html', 'order.html', 'contacts.html'];

async function withPage(file, check) {
    const page = await browser.newPage();
    page.setDefaultTimeout(3000);
    try {
        await page.goto(new URL('../' + file, import.meta.url).href);
        await check(page);
    } finally { await page.close(); }
}

test('every internal page offers a breadcrumb link back to the home page', async () => {
    for (const file of pages.slice(1)) {
        await withPage(file, async page => {
            const breadcrumbs = page.getByRole('navigation', { name: 'Хлебные крошки' });
            assert.equal(await breadcrumbs.count(), 1);
            assert.equal(await breadcrumbs.locator('span').count(), 1);
            await breadcrumbs.getByRole('link', { name: 'Главная' }).click();
            assert.ok(page.url().endsWith('index.html'));
        });
    }
});

test('all pages share the same menu including links to home sections', async () => {
    let expected;
    for (const file of pages) {
        await withPage(file, async page => {
            const links = await page.locator('.site-nav a').evaluateAll(items => items.map(a => a.getAttribute('href')));
            assert.ok(links.includes('index.html#popular'));
            assert.ok(links.includes('index.html#advantages'));
            assert.ok(links.includes('index.html#contacts'));
            if (expected) assert.deepEqual(links, expected);
            expected = links;
        });
    }
});

test('cross-page anchor reaches and highlights the requested home section', () => withPage('contacts.html', async page => {
    const link = page.locator('.site-nav a[href="index.html#popular"]');
    assert.equal(await link.count(), 1);
    await link.click();
    assert.ok(page.url().endsWith('index.html#popular'));
    assert.equal(await page.locator('#popular').evaluate(el => el.matches(':target')), true);
    assert.equal(await page.locator('#popular').evaluate(el => getComputedStyle(el).outlineStyle), 'dashed');
    await page.waitForFunction(() => document.querySelector('#popular').getBoundingClientRect().top < 200);
}));

test('each page provides a distinct document title and description', async () => {
    const titles = new Set();
    const descriptions = new Set();
    for (const file of pages) {
        await withPage(file, async page => {
            titles.add(await page.title());
            descriptions.add(await page.locator('meta[name="description"]').getAttribute('content'));
        });
    }
    assert.equal(titles.size, 5);
    assert.equal(descriptions.size, 5);
});
