import { test, expect } from '@playwright/test';

test('Text Generator: Generate text with different character counts', async ({ page }) => {
  // Open application
  await page.goto('https://onlytests.io');

  // Go to Text Generator tool
  await page.click('a[href="/text-generator"]');

  // Enter values in count field
  const values = [10, 50, 100, 200];
  for (const value of values) {
    await page.fill('input[name="count"]', value.toString());
    await page.click('button:has-text("Generate")');

    const generatedText = await page.locator('div.generated-text').innerText();
    expect(generatedText.length).toBe(value);
  }
});
