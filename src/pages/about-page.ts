import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class AboutPage extends BasePage {
  // Make page property public to match interface
  public readonly page: Page;

  // Page elements
  private get aboutContent() { return this.page.locator('main').first(); }

  private get aboutSections() { return this.page.locator('h2'); }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.page = page;
  }

  /**
   * Navigate to about page
   */
  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/about`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for about page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState('domcontentloaded');
    await this.waitForElement(this.pageTitle);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Get page content
   */
  async getPageContent(): Promise<string> {
    return await this.aboutContent.textContent() || '';
  }

  /**
   * Check if content is visible
   */
  async isContentVisible(): Promise<boolean> {
    return await this.mainContent.count() > 0;
  }

  /**
   * Get about page specific content
   */
  async getAboutContent(): Promise<string> {
    return await this.aboutContent.textContent() || '';
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Navigate back to home
   */
  async navigateToHome(): Promise<void> {
    await this.page.goto(this.baseUrl);
  }

  /**
   * Verify about page loaded correctly
   */
  async verifyAboutPageLoaded(): Promise<boolean> {
    const currentUrl = await this.getCurrentUrl();
    const expectedTitle = 'About';
    const pageTitle = await this.getPageTitle();
    
    return currentUrl.includes('/about') && 
           pageTitle.toLowerCase().includes(expectedTitle.toLowerCase()) &&
           await this.isContentVisible();
  }

  /**
   * Get about page sections
   */
  async getAboutSections(): Promise<string[]> {
    return await this.getAllTextContents(this.aboutSections);
  }

  /**
   * Check if specific section exists
   */
  async hasSection(sectionName: string): Promise<boolean> {
    const sectionSelector = `h2:has-text("${sectionName}")`;
    return await this.elementExists(sectionSelector);
  }
} 