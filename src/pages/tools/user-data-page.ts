import { Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class UserDataPage extends BasePage {
  // Make page property public to match interface
  public readonly page: Page;

  // Page elements
  private get numberOfUsersInput() { return this.page.locator('input[id="numUsers"]'); }

  private get languageSelect() { return this.page.locator('select[id="language"]'); }

  private get regenerateButton() { return this.page.locator('button:has-text("Regenerate Data")'); }

  private get countrySelect() { return this.page.locator('select').nth(3); }

  private get stateSelect() { return this.page.locator('select').nth(1); }

  private get citySelect() { return this.page.locator('select').nth(2); }

  private get userCards() { return this.page.locator('main main > div:last-child > div'); }

  private get userAvatars() { return this.page.locator('img[alt="User Avatar"]'); }

  private get downloadAvatarButtons() { return this.page.locator('button:has-text("Download Avatar")'); }

  private get copyableFields() { return this.page.locator('p'); }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.page = page;
  }

  /**
   * Navigate to user data generator tool
   */
  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/tools/user-data`);
    await this.waitForPageLoad();
  }

  /**
   * Wait for user data page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState();
    await this.waitForElement(this.pageTitle);
  }

  /**
   * Get user data generator title
   */
  async getToolTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Check if any content is visible
   */
  async isContentVisible(): Promise<boolean> {
    return await this.mainContent.count() > 0;
  }

  /**
   * Set number of users to generate
   */
  async setNumberOfUsers(count: number): Promise<void> {
    await this.fillInput(this.numberOfUsersInput, count.toString());
  }

  /**
   * Get current number of users setting
   */
  async getNumberOfUsers(): Promise<number> {
    const value = await this.getInputValue(this.numberOfUsersInput);
    return parseInt(value, 10);
  }

  /**
   * Set language for data generation
   */
  async setLanguage(language: string): Promise<void> {
    await this.selectOption(this.languageSelect, language);
  }

  /**
   * Get current language setting
   */
  async getCurrentLanguage(): Promise<string> {
    return await this.languageSelect.inputValue();
  }

  /**
   * Select country for location data
   */
  async selectCountry(countryName: string): Promise<void> {
    await this.selectOption(this.countrySelect, countryName);
  }

  /**
   * Select state/province for location data
   */
  async selectState(stateName: string): Promise<void> {
    await this.selectOption(this.stateSelect, stateName);
  }

  /**
   * Select city for location data
   */
  async selectCity(cityName: string): Promise<void> {
    await this.selectOption(this.citySelect, cityName);
  }

  /**
   * Generate new user data
   */
  async regenerateData(): Promise<void> {
    await this.clickElement(this.regenerateButton);
    // Wait for generation to complete
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get number of generated user cards
   */
  async getNumberOfUserCards(): Promise<number> {
    return await this.userCards.count();
  }

  /**
   * Get user data from a specific card
   */
  async getUserData(cardIndex: number = 0): Promise<Record<string, string>> {
    const card = this.userCards.nth(cardIndex);
    const fieldDivs = card.locator('> div');
    
    const userData: Record<string, string> = {};
    const count = await fieldDivs.count();
    
    for (let i = 0; i < count; i++) {
      const fieldDiv = fieldDivs.nth(i);
      const paragraph = fieldDiv.locator('p');
      
      if (await paragraph.count() > 0) {
        const text = await paragraph.textContent() || '';
        
        // Parse "Label: Value" format
        const colonIndex = text.indexOf(':');
        if (colonIndex > 0) {
          const label = text.substring(0, colonIndex).trim();
          const value = text.substring(colonIndex + 1).trim();
          userData[label] = value;
        }
      }
    }
    
    return userData;
  }

  /**
   * Download avatar for a specific user
   */
  async downloadAvatar(cardIndex: number = 0): Promise<void> {
    const downloadButton = this.downloadAvatarButtons.nth(cardIndex);
    await this.clickElement(downloadButton);
  }

  /**
   * Check if avatar download is available
   */
  async isAvatarDownloadAvailable(cardIndex: number = 0): Promise<boolean> {
    const downloadButton = this.downloadAvatarButtons.nth(cardIndex);
    return await this.isElementEnabled(downloadButton);
  }

  /**
   * Get all generated user data
   */
  async getAllUserData(): Promise<Record<string, string>[]> {
    const count = await this.getNumberOfUserCards();
    const allData: Record<string, string>[] = [];
    
    for (let i = 0; i < count; i++) {
      const userData = await this.getUserData(i);
      allData.push(userData);
    }
    
    return allData;
  }

  /**
   * Verify that generated data contains expected fields
   */
  async verifyGeneratedDataStructure(): Promise<boolean> {
    const userData = await this.getUserData(0);
    const expectedFields = ['Full Name', 'Username', 'Job Title', 'Phone', 'Email', 'Country', 'State', 'City', 'Address', 'Zip Code'];
    
    return expectedFields.every(field => userData[field] !== undefined);
  }

  /**
   * Check if location selection is working
   */
  async isLocationSelectionWorking(): Promise<boolean> {
    const countryCount = await this.countrySelect.locator('option').count();
    return countryCount > 1; // Should have more than just the default option
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
    return await this.mainContent.textContent() || '';
  }
} 