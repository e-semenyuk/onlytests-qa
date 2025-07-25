import { test } from '../../src/core/test-base';
import { expect } from '@playwright/test';

test.describe('OnlyTests Tools', () => {
  
  test('should navigate to user data tool', async ({ toolPage }) => {
    await toolPage.navigateToTool('user-data');
    await toolPage.waitForPageLoad();
    
    const currentUrl = await toolPage.getCurrentUrl();
    expect(currentUrl).toContain('/tools/user-data');
    
    const toolPath = await toolPage.getToolPath();
    expect(toolPath).toBe('user-data');
    
    const isContentVisible = await toolPage.isContentVisible();
    expect(isContentVisible).toBe(true);
  });

  test('should navigate to count tool', async ({ toolPage }) => {
    await toolPage.navigateToTool('count-tool');
    await toolPage.waitForPageLoad();
    
    const currentUrl = await toolPage.getCurrentUrl();
    expect(currentUrl).toContain('/tools/count-tool');
    
    const toolPath = await toolPage.getToolPath();
    expect(toolPath).toBe('count-tool');
    
    const isContentVisible = await toolPage.isContentVisible();
    expect(isContentVisible).toBe(true);
  });

  test('should navigate to date calculator tool', async ({ toolPage }) => {
    await toolPage.navigateToTool('date-calculator');
    await toolPage.waitForPageLoad();
    
    const currentUrl = await toolPage.getCurrentUrl();
    expect(currentUrl).toContain('/tools/date-calculator');
    
    const toolPath = await toolPage.getToolPath();
    expect(toolPath).toBe('date-calculator');
    
    const isContentVisible = await toolPage.isContentVisible();
    expect(isContentVisible).toBe(true);
  });

  test('should verify tool content is visible for all tools', async ({ toolPage }) => {
    const tools = ['user-data', 'count-tool', 'date-calculator'];
    
    for (const tool of tools) {
      await toolPage.navigateToTool(tool);
      await toolPage.waitForPageLoad();
      
      const isContentVisible = await toolPage.isContentVisible();
      expect(isContentVisible).toBe(true);
      
      const toolTitle = await toolPage.getToolTitle();
      expect(toolTitle).toBeTruthy();
    }
  });

  test('should maintain tool state during navigation', async ({ toolPage }) => {
    // Navigate to first tool
    await toolPage.navigateToTool('user-data');
    let toolPath = await toolPage.getToolPath();
    expect(toolPath).toBe('user-data');
    
    // Navigate to second tool
    await toolPage.navigateToTool('count-tool');
    toolPath = await toolPage.getToolPath();
    expect(toolPath).toBe('count-tool');
    
    // Navigate to third tool
    await toolPage.navigateToTool('date-calculator');
    toolPath = await toolPage.getToolPath();
    expect(toolPath).toBe('date-calculator');
  });
}); 