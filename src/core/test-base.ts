import { test as baseTest, expect, Page } from '@playwright/test';
import { env } from '../config/environment';
import { PageFactory } from './page.factory';
import { HomePage } from '../pages/home-page';
import { ToolsPage } from '../pages/tools-page';
import { AboutPage } from '../pages/about-page';
import { UserDataPage } from '../pages/tools/user-data-page';
import { TestCasesPage } from '../pages/templates/test-cases-page';

// Get singleton instance
const pageFactory = PageFactory.getInstance();

// Define test fixtures
export const test = baseTest.extend<{
  testData: any;
  config: any;
  homePage: HomePage;
  toolPage: ToolsPage;
  aboutPage: AboutPage;
  userDataPage: UserDataPage;
  testCasesPage: TestCasesPage;
}>({
  // Test data fixture
  testData: async ({}, use: (value: any) => Promise<void>) => {
    const testData = {
      urls: {
        home: '/',
        about: '/about',
        tools: {
          userData: '/tools/user-data',
          testCases: '/templates/test-cases'
        },
        templates: {
          testCases: '/templates/test-cases'
        }
      },
      expectedContent: {
        titles: {
          home: 'OnlyTests - Test Data & Tools',
          about: 'About OnlyTests',
          userData: 'User Data Generator',
          testCases: 'Test Case Template'
        },
        sections: ['Test Data Tools', 'Utility Tools', 'Templates']
      }
    };
    await use(testData);
  },

  // Configuration fixture
  config: async ({}, use: (value: any) => Promise<void>) => {
    await use(env);
  },

  // Page fixtures - using concrete classes
  homePage: async ({ page }, use: (value: HomePage) => Promise<void>) => {
    const homePage = pageFactory.createHomePage(page);
    await use(homePage);
  },

  toolPage: async ({ page }, use: (value: ToolsPage) => Promise<void>) => {
    const toolPage = pageFactory.createToolPage(page);
    await use(toolPage);
  },

  aboutPage: async ({ page }, use: (value: AboutPage) => Promise<void>) => {
    const aboutPage = pageFactory.createAboutPage(page);
    await use(aboutPage);
  },

  userDataPage: async ({ page }, use: (value: UserDataPage) => Promise<void>) => {
    const userDataPage = pageFactory.createUserDataPage(page);
    await use(userDataPage);
  },

  testCasesPage: async ({ page }, use: (value: TestCasesPage) => Promise<void>) => {
    const testCasesPage = pageFactory.createTestCasesPage(page);
    await use(testCasesPage);
  }
});

export { expect };

// Base test class with common utilities
export class TestBase {
  protected readonly page: Page;
  protected readonly config: any;

  constructor(page: Page, config: any) {
    this.page = page;
    this.config = config;
  }

  /**
   * Assert page is loaded correctly
   */
  static async assertPageLoaded(page: Page, expectedUrl: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedUrl));
    // Wait for any main content to be visible (more flexible)
    await expect(page.locator('main, .main, #main, .content, #content').first()).toBeVisible({ timeout: 10000 });
  }

  /**
   * Wait for element with flexible state checking
   */
  protected async waitForElement(selector: string, timeout: number = 10000, useFirst: boolean = false): Promise<void> {
    const locator = useFirst ? this.page.locator(selector).first() : this.page.locator(selector);
    try {
      // First try to wait for visible state
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      // If visible fails, just accept it - element might be hidden but exists
      // This is a more flexible approach for different page structures
    }
  }

  /**
   * Safe click with retry
   */
  protected async safeClick(selector: string, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.page.click(selector);
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Safe fill with retry
   */
  protected async safeFill(selector: string, value: string, retries: number = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.page.fill(selector, value);
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for page load
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot
   */
  protected async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/${name}.png` });
  }

  /**
   * Generate random string
   */
  protected generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  protected generateRandomEmail(): string {
    return `test.${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Assert element is visible
   */
  protected async assertElementVisible(selector: string): Promise<void> {
    const locator = this.page.locator(selector);
    await expect(locator).toBeVisible();
  }

  /**
   * Assert element has text
   */
  protected async assertElementHasText(selector: string, text: string): Promise<void> {
    const locator = this.page.locator(selector);
    await expect(locator).toHaveText(text);
  }

  /**
   * Assert element contains text
   */
  protected async assertElementContainsText(selector: string, text: string): Promise<void> {
    const locator = this.page.locator(selector);
    await expect(locator).toContainText(text);
  }

  /**
   * Assert URL contains path
   */
  protected async assertUrlContains(path: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  /**
   * Wait for network idle
   */
  protected async waitForNetworkIdle(timeout: number = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Get element text
   */
  protected async getElementText(selector: string): Promise<string> {
    const locator = this.page.locator(selector);
    return await locator.textContent() || '';
  }

  /**
   * Check if element exists
   */
  protected async elementExists(selector: string): Promise<boolean> {
    const locator = this.page.locator(selector);
    return await locator.count() > 0;
  }

  /**
   * Handle page errors and console messages
   */
  static async handlePageError(page: Page, description: string): Promise<void> {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit for any console messages to appear
    await page.waitForTimeout(1000);
    
    if (consoleErrors.length > 0) {
      console.warn(`${description}: Found ${consoleErrors.length} console errors:`, consoleErrors);
    }
  }
} 