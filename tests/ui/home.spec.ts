import { test } from '../../src/core/test-base';
import { TestBase } from '../../src/core/test-base';
import { expect } from '@playwright/test';

test.describe('OnlyTests Homepage', () => {
  
  test('should load homepage with correct title', async ({ homePage }) => {
    const expectedTitle = 'OnlyTests';
    
    await homePage.navigate();
    await homePage.waitForPageLoad();
    
    const title = await homePage.getPageTitle();
    expect(title).toContain(expectedTitle);
  });

  test('should display welcome message', async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForPageLoad();
    
    const welcomeMessage = await homePage.getWelcomeMessage();
    expect(welcomeMessage).toBeTruthy();
    expect(welcomeMessage.length).toBeGreaterThan(0);
  });

  test('should display all main sections', async ({ homePage }) => {
    const expectedSections = ['Test Data Generation', 'Utility Tools', 'Templates'];
    
    await homePage.navigate();
    await homePage.waitForPageLoad();
    
    // Verify all sections are visible
    const allSectionsVisible = await homePage.verifyAllSectionsVisible();
    expect(allSectionsVisible).toBe(true);
    
    // Verify each section individually
    for (const section of expectedSections) {
      const isVisible = await homePage.isSectionVisible(section);
      expect(isVisible).toBe(true);
    }
  });

  test('should have correct section titles', async ({ homePage }) => {
    const expectedSections = ['Test Data Generation', 'Utility Tools', 'Templates'];
    
    await homePage.navigate();
    const sectionTitles = await homePage.getSectionTitles();
    
    expect(sectionTitles.length).toBeGreaterThanOrEqual(expectedSections.length);
    
    const titlesText = sectionTitles.join(' ').toLowerCase();
    for (const section of expectedSections) {
      expect(titlesText).toContain(section.toLowerCase());
    }
  });

  test('should navigate to test data tools', async ({ homePage, page }) => {
    const expectedUrl = '/tools/user-data';
    
    await homePage.navigate();
    await homePage.navigateToTestDataTools();
    
    await TestBase.assertPageLoaded(page, expectedUrl);
  });

  test('should navigate to utility tools', async ({ homePage, page }) => {
    const expectedUrl = '/tools/count-tool';
    
    await homePage.navigate();
    await homePage.navigateToUtilityTools();
    
    await TestBase.assertPageLoaded(page, expectedUrl);
  });

  test('should navigate to templates', async ({ homePage, page }) => {
    const expectedUrl = '/templates/test-cases';
    
    await homePage.navigate();
    await homePage.navigateToTemplates();
    
    await TestBase.assertPageLoaded(page, expectedUrl);
  });

  test('should navigate to about page', async ({ homePage, page }) => {
    const expectedUrl = '/about';
    
    await homePage.navigate();
    await homePage.navigateToAbout();
    
    await TestBase.assertPageLoaded(page, expectedUrl);
  });

  test('should navigate to terms page', async ({ homePage, page }) => {
    const expectedUrl = '/terms';
    
    await homePage.navigate();
    await homePage.navigateToTerms();
    
    await TestBase.assertPageLoaded(page, expectedUrl);
  });

  test('should verify welcome message content', async ({ homePage }) => {
    await homePage.navigate();
    
    const welcomeMessageValid = await homePage.verifyWelcomeMessage();
    expect(welcomeMessageValid).toBe(true);
  });

  test('should handle page content verification', async ({ homePage }) => {
    await homePage.navigate();
    
    const contentVisible = await homePage.isContentVisible();
    expect(contentVisible).toBe(true);
    
    const pageContent = await homePage.getPageContent();
    expect(pageContent).toBeTruthy();
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('should be responsive and accessible', async ({ homePage, page }) => {
    await homePage.navigate();
    
    // Check for console errors
    await TestBase.handlePageError(page, 'Checking for console errors');
    
    // Verify page loads without critical issues
    const contentVisible = await homePage.isContentVisible();
    expect(contentVisible).toBe(true);
  });
}); 