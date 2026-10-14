import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true });
after(() => browser.close());

async function catalog(width, check) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    try {
        await page.goto(new URL('../catalog.html', import.meta.url).href);
        await check(page);
    } finally { await page.close(); }
}

test('catalog has named Grid areas and three product columns', () => catalog(1280, async page => {
    const layout = await page.locator('.catalog-layout').evaluate(el => {
        const s = getComputedStyle(el);
        return { display: s.display, areas: s.gridTemplateAreas };
    });
    assert.equal(layout.display, 'grid');
    assert.equal(layout.areas, '"filters products"');
    const filters = await page.locator('.catalog-filters').boundingBox();
    const products = await page.locator('.catalog-products').boundingBox();
    assert.ok(filters.x + filters.width < products.x);
    const cards = await page.locator('.product-card').evaluateAll(els => els.map(el => el.getBoundingClientRect().top));
    assert.equal(new Set(cards.slice(0, 3)).size, 1);
    assert.equal(new Set(cards.slice(3, 6)).size, 1);
    assert.ok(cards[3] > cards[0]);
}));

test('cards use column Flex and align action rows despite unequal descriptions', () => catalog(1280, async page => {
    await page.locator('.product-card__description').first().evaluate(el => el.textContent += ' Дополнительное длинное описание товара, которое занимает несколько строк.');
    for (const card of await page.locator('.product-card').all()) {
        assert.deepEqual(await card.evaluate(el => {
            const s = getComputedStyle(el);
            return [s.display, s.flexDirection];
        }), ['flex', 'column']);
    }
    const bottoms = await page.locator('.product-card__actions').evaluateAll(els => els.map(el => el.getBoundingClientRect().bottom));
    for (const row of [bottoms.slice(0, 3), bottoms.slice(3, 6)]) {
        assert.ok(Math.max(...row) - Math.min(...row) < 1);
    }
}));

test('filters are accessible and honestly identified as a non-functional mockup', () => catalog(1280, async page => {
    await page.getByLabel('Популярные', { exact: true }).check();
    await page.getByLabel('Цена от').fill('1000');
    assert.equal(await page.getByLabel('Цена от').inputValue(), '1000');
    assert.equal(await page.getByRole('button', { name: 'Применить' }).isDisabled(), true);
    assert.match(await page.locator('.catalog-filters').innerText(), /не изменяют список товаров/);
}));

test('narrow catalog stacks named areas without horizontal overflow', () => catalog(375, async page => {
    assert.equal(await page.locator('.catalog-layout').evaluate(el => getComputedStyle(el).gridTemplateAreas), '"filters" "products"');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}));
