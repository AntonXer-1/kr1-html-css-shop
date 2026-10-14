import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true });
after(() => browser.close());

async function open(file, check, width = 1280, javaScriptEnabled = true) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', javaScriptEnabled });
    page.setDefaultTimeout(3000);
    try {
        await page.goto(new URL('../' + file, import.meta.url).href);
        await check(page);
    } finally { await page.close(); }
}

test('six catalog products each link to a matching description', () => open('catalog.html', async page => {
    assert.equal(await page.locator('.product-card').count(), 6);
    for (let i = 0; i < 6; i++) {
        const card = page.locator('.product-card').nth(i);
        const title = await card.locator('.product-card__title').innerText();
        await card.getByRole('link', { name: 'Подробнее' }).click();
        assert.equal(await page.getByRole('heading', { name: title, exact: true, level: i === 0 ? 1 : 2 }).isVisible(), true);
        await page.goto(new URL('../catalog.html', import.meta.url).href);
    }
}));

test('new catalog items are available in the application form', () => open('order.html', async page => {
    for (const product of ['Веб-камера View', 'USB-концентратор Hub', 'Коврик Desk']) {
        await page.locator('#selected-product').selectOption({ label: product });
        assert.equal(await page.locator('#selected-product').inputValue(), product);
    }
}));

test('keyboard detail includes a loaded accessible illustration and usage description', () => open('product.html', async page => {
    const img = page.getByRole('img', { name: 'Схематичное изображение клавиатуры Quiet', exact: true });
    assert.equal(await img.count(), 1);
    assert.equal(await img.evaluate(el => el.complete && el.naturalWidth > 0), true);
    assert.equal(await page.getByRole('heading', { name: 'Для каких задач подходит' }).count(), 1);
}));

test('FAQ answers can be opened from the keyboard without custom JavaScript', () => open('index.html', async page => {
    assert.equal(await page.locator('.faq__item').count(), 3);
    const first = page.locator('.faq__item').first();
    assert.equal(await first.locator('.faq__answer').isVisible(), false);
    await first.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.equal(await first.locator('.faq__answer').isVisible(), true);
    await page.keyboard.press('Enter');
    assert.equal(await first.locator('.faq__answer').isVisible(), false);
}, 1280, false));

test('comparison table scrolls inside its container on a narrow screen', () => open('catalog.html', async page => {
    const table = page.locator('#comparison table');
    assert.equal(await table.locator('caption').count(), 1);
    assert.equal(await table.locator('thead th[scope="col"]').count(), 4);
    assert.equal(await table.locator('tbody th[scope="row"]').count(), 3);
    assert.equal(await page.locator('.table-scroll').evaluate(el => el.scrollWidth > el.clientWidth), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}, 375));
