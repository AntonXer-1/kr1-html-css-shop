import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true });
after(() => browser.close());
const pages = ['index.html', 'catalog.html', 'product.html', 'order.html', 'contacts.html'];
async function open(name, check, width = 1280) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    try {
        await page.goto(new URL('../' + name, import.meta.url).href);
        await check(page);
    } finally { await page.close(); }
}
test('navigation reaches all five routes with unique page titles', () => open('index.html', async page => {
    const titles = new Set();
    for (const file of pages) {
        await page.locator('.site-nav a[href="' + file + '"]').click();
        assert.ok(page.url().endsWith(file));
        titles.add(await page.title());
        assert.equal(await page.locator('main').count(), 1);
        assert.equal(await page.locator('.site-nav [aria-current="page"]').getAttribute('href'), file);
    }
    assert.equal(titles.size, 5);
}));
test('standalone form validates and never transmits data', () => open('order.html', async page => {
    const errors = [];
    const outbound = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.method() === 'POST' || /^https?:/.test(request.url())) outbound.push(request.url()); });
    await page.locator('[type="submit"]').click();
    assert.equal(await page.locator('#email').getAttribute('aria-invalid'), 'true');
    assert.equal(await page.locator('#success-message').isVisible(), false);
    await page.locator('#name').fill('Антон Чернышев');
    await page.locator('#email').fill('anton@example.com');
    await page.locator('#phone').fill('+7 (900) 123-45-67');
    await page.locator('#topic').selectOption('consultation');
    await page.locator('#agreement').check();
    await page.locator('[type="submit"]').click();
    assert.equal(await page.locator('#success-message').isVisible(), true);
    assert.equal(await page.locator('#email').inputValue(), '');
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 0);
    assert.deepEqual(outbound, []);
    assert.deepEqual(errors, []);
}));
test('modal reopens without stale errors and keeps chosen product', () => open('index.html', async page => {
    await page.locator('.product-card__button').first().click();
    await page.locator('[type="submit"]').click();
    assert.ok(await page.locator('[aria-invalid="true"]').count() > 0);
    await page.keyboard.press('Escape');
    await page.locator('.product-card__button').nth(1).click();
    assert.equal(await page.locator('[aria-invalid="true"]').count(), 0);
    assert.equal(await page.locator('#selected-product').inputValue(), 'Мышь Motion');
}));
test('catalog grid and navigation flex are used for real layout', () => open('catalog.html', async page => {
    assert.equal(await page.locator('.product-grid').evaluate(el => getComputedStyle(el).display), 'grid');
    assert.equal(await page.locator('.site-nav__list').evaluate(el => getComputedStyle(el).display), 'flex');
    const boxes = await page.locator('.product-card').evaluateAll(cards => cards.map(el => el.getBoundingClientRect().x));
    assert.equal(new Set(boxes).size, 3);
}));
test('all pages fit narrow viewport without horizontal overflow', async () => {
    for (const file of pages) {
        await open(file, async page => {
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), file);
        }, 375);
    }
});
