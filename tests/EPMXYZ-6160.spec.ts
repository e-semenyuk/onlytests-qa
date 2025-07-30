import { test, expect } from '@playwright/test';
import { TextGeneratorPage } from '../pageObjects/TextGeneratorPage';

test('EPMXYZ-6160: Text Generator generates correct number of characters', async ({ page }) => {
  const textGenerator = new TextGeneratorPage(page);
  await textGenerator.navigate();

  const values = [10, 50, 100, 200];

  for (const value of values) {
    await textGenerator.enterCount(value);
    const generatedText = await textGenerator.getGeneratedText();
    expect(generatedText.length).toBe(value);
  }
});
