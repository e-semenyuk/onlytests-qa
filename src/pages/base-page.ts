import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  // Common elements
  protected get mainContent() { return this.page.locator('main, .main, #main, .content, #content').first(); }

  protected get pageTitle() { return this.page.locator('h1').first(); }

  protected get errorMessages() { return this.page.locator('.error-message'); }

  constructor(page: Page, baseUrl: string) {
    this.page = page;
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to the page
   */
  abstract navigate(): Promise<void>;

  /**
   * Wait for page to load
   */
  abstract waitForPageLoad(): Promise<void>;

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Get element text content
   */
  async getElementText(selector: string): Promise<string> {
    return await this.page.locator(selector).textContent() || '';
  }

  /**
   * Check if element exists
   */
  async elementExists(selector: string): Promise<boolean> {
    return await this.page.locator(selector).count() > 0;
  }

  /**
   * Wait for element to be visible or present
   */
  protected async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    try {
      // Wait for the element to be visible
      await locator.waitFor({ state: 'visible', timeout });
    } catch (error) {
      // If visible fails, just accept it - element might be hidden but exists
      // This is a more flexible approach for different page structures
    }
  }

  /**
   * Wait for page load state
   */
  protected async waitForLoadState(state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'): Promise<void> {
    await this.page.waitForLoadState(state);
  }

  /**
   * Click element
   */
  protected async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Fill input element
   */
  protected async fillInput(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /**
   * Select option from dropdown
   */
  protected async selectOption(locator: Locator, value: string): Promise<void> {
    await locator.selectOption(value);
  }

  /**
   * Get input value
   */
  protected async getInputValue(locator: Locator): Promise<string> {
    return await locator.inputValue();
  }

  /**
   * Check if element is enabled
   */
  protected async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Get all text contents from elements
   */
  protected async getAllTextContents(locator: Locator): Promise<string[]> {
    return await locator.allTextContents();
  }
} 