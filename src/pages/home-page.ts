import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {
  // Make page property public to match interface
  public readonly page: Page;

  // Page elements
  private get welcomeMessage() { return this.page.locator('h1'); }

  private get homeDescription() { return this.page.locator('p.text-lg'); }

  private get sectionTitles() { return this.page.locator('h2.text-2xl'); }

  private get homeMainContent() { return this.page.locator('main').first(); }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.page = page;
  }

  /**
   * Navigate to the home page
   */
  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for home page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState('domcontentloaded');
    await this.waitForElement(this.pageTitle);
  }

  /**
   * Get welcome message
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }

  /**
   * Get home description
   */
  async getHomeDescription(): Promise<string> {
    return await this.homeDescription.textContent() || '';
  }

  /**
   * Get section titles
   */
  async getSectionTitles(): Promise<string[]> {
    return await this.getAllTextContents(this.sectionTitles);
  }

  /**
   * Check if section is visible
   */
  async isSectionVisible(sectionName: string): Promise<boolean> {
    const sectionSelector = `h2:has-text("${sectionName}")`;
    return await this.elementExists(sectionSelector);
  }

  /**
   * Get page content
   */
  async getPageContent(): Promise<string> {
    return await this.homeMainContent.textContent() || '';
  }

  /**
   * Check if content is visible
   */
  async isContentVisible(): Promise<boolean> {
    return await this.homeMainContent.count() > 0;
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Navigate to test data tools section
   */
  async navigateToTestDataTools(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/tools/user-data`);
  }

  /**
   * Navigate to utility tools section
   */
  async navigateToUtilityTools(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/tools/count-tool`);
  }

  /**
   * Navigate to templates section
   */
  async navigateToTemplates(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/templates/test-cases`);
  }

  /**
   * Navigate to about page
   */
  async navigateToAbout(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/about`);
  }

  /**
   * Navigate to terms page
   */
  async navigateToTerms(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/terms`);
  }

  /**
   * Verify all main sections are visible
   */
  async verifyAllSectionsVisible(): Promise<boolean> {
    const sections = ['Test Data Generation', 'Utility Tools', 'Templates'];
    for (const section of sections) {
      if (!(await this.isSectionVisible(section))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Verify welcome message contains expected text
   */
  async verifyWelcomeMessage(): Promise<boolean> {
    const welcomeMessage = await this.getWelcomeMessage();
    const expectedTitle = 'OnlyTests';
    return welcomeMessage.toLowerCase().includes(expectedTitle.toLowerCase());
  }

  /**
   * Get test data tools section visibility
   */
  async getTestDataToolsSection(): Promise<boolean> {
    return await this.isSectionVisible('Test Data Tools');
  }

  /**
   * Get utility tools section visibility
   */
  async getUtilityToolsSection(): Promise<boolean> {
    return await this.isSectionVisible('Utility Tools');
  }

  /**
   * Get templates section visibility
   */
  async getTemplatesSection(): Promise<boolean> {
    return await this.isSectionVisible('Templates');
  }

  /**
   * Get card titles
   */
  async getCardTitles(): Promise<string[]> {
    const cardTitles = await this.page.locator('.card h3').allTextContents();
    return cardTitles;
  }
} 