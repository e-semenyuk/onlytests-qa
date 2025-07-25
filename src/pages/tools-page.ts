import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ToolsPage extends BasePage {
  // Make page property public to match interface
  public readonly page: Page;

  // Tool content elements
  private get toolContent() {
    return this.page.locator('main, .main, #main, .content, #content, [data-testid], .tool-content').first();
  }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.page = page;
  }

  /**
   * Navigate to the tools page
   */
  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/tools`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Navigate to a specific tool
   */
  async navigateToTool(toolPath: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}/tools/${toolPath}`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for tools page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState('domcontentloaded');
    // Wait for any visible content to be present (more flexible)
    await this.waitForElement(this.toolContent, 10000);
  }

  /**
   * Get current tool path from URL
   */
  async getToolPath(): Promise<string> {
    const url = this.page.url();
    const toolPathMatch = url.match(/\/tools\/(.+)$/);
    return toolPathMatch ? toolPathMatch[1] : '';
  }

  /**
   * Get current tool path (alias for getToolPath)
   */
  async getCurrentToolPath(): Promise<string> {
    return await this.getToolPath();
  }

  /**
   * Get tool title
   */
  async getToolTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Check if content is visible
   */
  async isContentVisible(): Promise<boolean> {
    return await this.mainContent.count() > 0;
  }

  /**
   * Check if tool content is visible
   */
  async isToolContentVisible(): Promise<boolean> {
    return await this.toolContent.count() > 0;
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get page content
   */
  async getPageContent(): Promise<string> {
    return await this.page.content();
  }
} 