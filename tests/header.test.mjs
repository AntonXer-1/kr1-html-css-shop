import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test, after } from 'node:test';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true });
after(() => browser.close());

test('navigation stays at the top when any page is scrolled', async () => {
    for (const file of ['index', 'catalog', 'product', 'order', 'contacts']) {
        const page = await browser.newPage({ viewport: { width: 1280, height: 600 }, reducedMotion: 'reduce' });
        try {
            await page.goto(new URL('../' + file + '.html', import.meta.url).href);
            // Short pages also need to keep the same behavior when content grows.
            await page.locator('main').evaluate(el => el.style.minHeight = '1800px');
            await page.evaluate(() => scrollTo(0, 700));
            await page.waitForFunction(() => scrollY >= 700);
            const header = await page.locator('header').boundingBox();
            assert.ok(Math.abs(header.y) < 1, file + ': header scrolled out of view');
            assert.equal(await page.locator('.site-nav a').first().isVisible(), true);
            await page.locator('.back-top').click();
            await page.waitForFunction(() => scrollY < 1, null, { timeout: 2000 });
        } finally { await page.close(); }
    }
});

test('anchors remain below the header after menu wraps on resize', async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    try {
        await page.goto(new URL('../index.html', import.meta.url).href);
        for (const width of [1280, 375]) {
            await page.setViewportSize({ width, height: 900 });
            await page.locator('.site-nav a[href="index.html#popular"]').click();
            await page.waitForFunction(() => location.hash === '#popular');
            const header = await page.locator('header').boundingBox();
            const section = await page.locator('#popular').boundingBox();
            assert.ok(section.y >= header.y + header.height, width + ': anchor obscured by header');
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        }
    } finally { await page.close(); }
});
