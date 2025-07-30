import { test, expect } from '@playwright/test';
import { ToolsPage } from '../../../src/pages/tools-page';

const toolsPageUrl = 'http://localhost:3000/tools';
const toolPath = 'text-generator';

const values = [10, 50, 100, 200];

values.forEach(value => {
  test(`Text Generator generates ${value} characters`, async ({ page }) => {
    const toolsPage = new ToolsPage(page, toolsPageUrl);
    await toolsPage.navigate();
    await toolsPage.navigateToTool(toolPath);

    const countField = await page.locator('#count');
    await countField.fill(`${value}`);
    await countField.press('Enter');

    const generatedText = await page.locator('#generated-text');
    const textLength = await generatedText.evaluate(node => node.textContent.length);

    expect(textLength).toBe(value);
  });
});

// jira_issue_key: EPMXYZ-6160
