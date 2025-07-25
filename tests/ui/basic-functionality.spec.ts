import { test } from '../../src/core/test-base';
import { expect } from '@playwright/test';

test.describe('OnlyTests Basic Functionality', () => {
  
  test('should load about page directly', async ({ aboutPage }) => {
    await aboutPage.navigate();
    await aboutPage.waitForPageLoad();
    
    const currentUrl = await aboutPage.getCurrentUrl();
    expect(currentUrl).toContain('/about');
    
    const pageTitle = await aboutPage.getPageTitle();
    expect(pageTitle).toBeTruthy();
  });

  test('should load tools pages directly', async ({ toolPage }) => {
    const testTools = ['user-data', 'count-tool', 'date-calculator'];

    for (const tool of testTools) {
      await toolPage.navigateToTool(tool);
      await toolPage.waitForPageLoad();
      
      const currentUrl = await toolPage.getCurrentUrl();
      expect(currentUrl).toContain(`/tools/${tool}`);
      
      const pageTitle = await toolPage.getPageTitle();
      expect(pageTitle).toBeTruthy();
    }
  });

  test('should have consistent page structure across all pages', async ({ homePage, aboutPage, toolPage }) => {
    // Test homepage structure
    await homePage.navigate();
    await homePage.waitForPageLoad();
    const homeTitle = await homePage.getPageTitle();
    expect(homeTitle).toContain('OnlyTests');
    
    // Test about page structure
    await aboutPage.navigate();
    await aboutPage.waitForPageLoad();
    const aboutTitle = await aboutPage.getPageTitle();
    expect(aboutTitle).toBeTruthy();
    
    // Test tools page structure
    await toolPage.navigateToTool('user-data');
    await toolPage.waitForPageLoad();
    const toolsTitle = await toolPage.getPageTitle();
    expect(toolsTitle).toBeTruthy();
  });

  test('should handle URL navigation correctly', async ({ page }) => {
    // Test direct navigation to different pages
    const testUrls = [
      { url: '/', expected: '/' },
      { url: '/about', expected: '/about' },
      { url: '/tools/user-data', expected: '/tools/user-data' },
      { url: '/tools/count-tool', expected: '/tools/count-tool' }
    ];

    for (const testCase of testUrls) {
      await page.goto(testCase.url, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('domcontentloaded');
      
      const currentUrl = await page.url();
      expect(currentUrl).toContain(testCase.expected);
    }
  });
}); 