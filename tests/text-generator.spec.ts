import { test } from '../../src/core/test-base';
import { expect } from '@playwright/test';

test.describe('Text Generator Tool', () => {
  test('should generate text with different character counts', async ({ toolPage }) => {
    await toolPage.navigateToTool('text-generator');
    await toolPage.waitForPageLoad();

    const values = [10, 50, 100, 200];
    for (const value of values) {
      await toolPage.setCharacterCount(value);
      await toolPage.page.keyboard.press('Enter');
      await toolPage.page.waitForTimeout(3000); // Wait for text to be generated

      const generatedText = await toolPage.getGeneratedText();
      expect(generatedText.length).toBe(value);
    }
  });
});
