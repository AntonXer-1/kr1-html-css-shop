// Optional visual QA helper; run separately from *.test.mjs, outputs go to /private/tmp.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch({ headless: true });
try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    for (const name of ['index', 'catalog', 'product', 'order', 'contacts']) {
        await page.goto(new URL('../' + name + '.html', import.meta.url).href);
        await page.screenshot({ path: '/private/tmp/kr1-' + name + '.png', fullPage: true });
    }
    await page.goto(new URL('../index.html', import.meta.url).href);
    await page.locator('.product-card__button').first().click();
    await page.screenshot({ path: '/private/tmp/kr1-dialog.png' });
} finally { await browser.close(); }
