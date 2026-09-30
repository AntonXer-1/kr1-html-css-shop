import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const browser = await chromium.launch({ headless: true });
after(() => browser.close());

async function withPage(check) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
        await page.goto(new URL('../index.html', import.meta.url).href);
        await check(page);
    } finally {
        await page.close();
    }
}

test('changing the primary token updates buttons, links and the aside accent', () => withPage(async (page) => {
    await page.evaluate(() => document.documentElement.style.setProperty('--color-primary', '#663399'));
    for (const [selector, property] of [
        ['.product-card__button', 'backgroundColor'],
        ['.site-nav a', 'color'],
        ['.aside-info', 'borderLeftColor'],
    ]) {
        assert.equal(await page.locator(selector).first().evaluate((element, property) => getComputedStyle(element)[property], property), 'rgb(102, 51, 153)');
    }
}));

test('keyboard focus is visible on links, buttons and form fields', () => withPage(async (page) => {
    await page.evaluate(() => document.documentElement.style.setProperty('--color-primary', '#663399'));
    await page.keyboard.press('Tab');
    const logo = page.locator('.site-logo');
    assert.equal(await logo.evaluate((element) => element.matches(':focus-visible')), true);
    assert.notEqual(await logo.evaluate((element) => getComputedStyle(element).outlineStyle), 'none');
    assert.equal(await logo.evaluate((element) => getComputedStyle(element).outlineColor), 'rgb(102, 51, 153)');
    await page.locator('.product-card__button').first().focus();
    assert.notEqual(await page.locator('.product-card__button').first().evaluate((element) => getComputedStyle(element).outlineStyle), 'none');
    await page.keyboard.press('Enter');
    assert.notEqual(await page.locator('#name').evaluate((element) => getComputedStyle(element).outlineStyle), 'none');
}));

test('disabled buttons stay visually disabled when hovered', () => withPage(async (page) => {
    const button = page.locator('.product-card__button').first();
    await button.evaluate((element) => { element.disabled = true; });
    const before = await button.evaluate((element) => getComputedStyle(element).backgroundColor);
    await button.hover();
    assert.equal(await button.evaluate((element) => getComputedStyle(element).backgroundColor), before);
    assert.equal(await button.evaluate((element) => getComputedStyle(element).cursor), 'not-allowed');
    assert.ok(Number(await button.evaluate((element) => getComputedStyle(element).opacity)) < 1);
}));

test('invalid field keeps its error border on hover and focus', () => withPage(async (page) => {
    await page.evaluate(() => document.documentElement.style.setProperty('--color-danger', '#990033'));
    await page.locator('.product-card__button').first().click();
    await page.locator('[type="submit"]').click();
    const field = page.locator('#name');
    await field.hover();
    await field.focus();
    assert.equal(await field.evaluate((element) => getComputedStyle(element).borderTopColor), 'rgb(153, 0, 51)');
    assert.equal(await field.getAttribute('aria-invalid'), 'true');
}));

test('invalid checkbox has a distinct keyboard focus indicator', () => withPage(async (page) => {
    await page.locator('.product-card__button').first().click();
    await page.locator('[type="submit"]').click();
    const checkbox = page.locator('#agreement');
    const before = await checkbox.evaluate((element) => getComputedStyle(element).outlineStyle);
    await page.locator('#comment').focus();
    await page.keyboard.press('Tab');
    assert.equal(await checkbox.evaluate((element) => element.matches(':focus-visible')), true);
    assert.notEqual(await checkbox.evaluate((element) => getComputedStyle(element).outlineStyle), before);
}));
