import { test } from '../../src/core/test-base';
import { expect } from '@playwright/test';

test.describe('OnlyTests Navigation', () => {
  
  test('should navigate from home to about page', async ({ homePage, aboutPage }) => {
    await homePage.navigate();
    await homePage.navigateToAbout();
    
    const currentUrl = await aboutPage.getCurrentUrl();
    expect(currentUrl).toContain('/about');
    
    const pageTitle = await aboutPage.getPageTitle();
    expect(pageTitle).toBeTruthy();
  });

  test('should navigate from home to tools page', async ({ homePage, toolPage }) => {
    await homePage.navigate();
    await homePage.navigateToTestDataTools();
    
    const currentUrl = await toolPage.getCurrentUrl();
    expect(currentUrl).toContain('/tools/');
    
    const pageTitle = await toolPage.getPageTitle();
    expect(pageTitle).toBeTruthy();
  });

  test('should navigate between different tools', async ({ toolPage }) => {
    const tools = ['user-data', 'count-tool', 'date-calculator'];
    
    for (const tool of tools) {
      await toolPage.navigateToTool(tool);
      await toolPage.waitForPageLoad();
      
      const currentUrl = await toolPage.getCurrentUrl();
      expect(currentUrl).toContain(`/tools/${tool}`);
      
      const toolPath = await toolPage.getToolPath();
      expect(toolPath).toBe(tool);
    }
  });

  test('should maintain navigation state', async ({ homePage, aboutPage, toolPage }) => {
    // Navigate to home
    await homePage.navigate();
    let currentUrl = await homePage.getCurrentUrl();
    expect(currentUrl).toContain('/');
    
    // Navigate to about
    await homePage.navigateToAbout();
    currentUrl = await aboutPage.getCurrentUrl();
    expect(currentUrl).toContain('/about');
    
    // Navigate to tools
    await toolPage.navigateToTool('user-data');
    currentUrl = await toolPage.getCurrentUrl();
    expect(currentUrl).toContain('/tools/user-data');
  });
}); 