import { Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class TestCasesPage extends BasePage {
  // Make page property public to match interface
  public readonly page: Page;

  // Page elements - using more specific selectors
  private get testCaseIdInput() { return this.page.locator('main input').nth(0); }

  private get titleInput() { return this.page.locator('main input').nth(1); }

  private get prioritySelect() { return this.page.locator('main select').nth(0); }

  private get testTypeSelect() { return this.page.locator('main select').nth(1); }

  private get testLevelSelect() { return this.page.locator('main select').nth(2); }

  private get testPhaseInput() { return this.page.locator('main input').nth(2); }

  private get descriptionTextarea() { return this.page.locator('main textarea').nth(0); }

  private get preconditionsTextarea() { return this.page.locator('main textarea').nth(1); }

  private get testDataTextarea() { return this.page.locator('main textarea').nth(2); }

  // Steps
  private get addStepButton() { return this.page.locator('button:has-text("Add Step")'); }

  private get removeStepButtons() { return this.page.locator('button:has-text("Remove Step")'); }

  // Additional Information
  private get testEnvironmentInput() { return this.page.locator('main input').nth(3); }

  private get automationStatusSelect() { return this.page.locator('main select').nth(3); }

  private get testAreaInput() { return this.page.locator('main input').nth(4); }

  private get testScriptReferenceInput() { return this.page.locator('main input').nth(5); }

  private get createdByInput() { return this.page.locator('main input').nth(6); }

  private get creationDateInput() { return this.page.locator('main input[type="date"]').nth(0); }

  private get lastUpdatedInput() { return this.page.locator('main input[type="date"]').nth(1); }

  // Related Information
  private get requirementIdInput() { return this.page.locator('main input').nth(9); }

  private get userStoryLinkInput() { return this.page.locator('main input').nth(10); }

  // Tags
  private get newTagInput() { return this.page.locator('input[placeholder="Add Tag"]'); }

  private get addTagButton() { return this.page.locator('button:has-text("Add Tag")'); }

  private get predefinedTagButtons() { return this.page.locator('button:has-text("Smoke"), button:has-text("Regression"), button:has-text("Sanity"), button:has-text("Critical")'); }

  private get existingTags() { return this.page.locator('span:has-text("Smoke"), span:has-text("Regression"), span:has-text("Sanity"), span:has-text("Critical")').filter({ hasText: /^(Smoke|Regression|Sanity|Critical)$/ }); }

  // Export buttons
  private get exportToDocButton() { return this.page.locator('button:has-text("Export to DOC")'); }

  private get exportToExcelButton() { return this.page.locator('button:has-text("Export to Excel")'); }

  constructor(page: Page, baseUrl: string) {
    super(page, baseUrl);
    this.page = page;
  }

  /**
   * Navigate to test cases template
   */
  async navigate(): Promise<void> {
    await this.page.goto(`${this.baseUrl}/templates/test-cases`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
  }

  /**
   * Wait for test cases page to load
   */
  async waitForPageLoad(): Promise<void> {
    await this.waitForLoadState('domcontentloaded');
    await this.waitForElement(this.pageTitle);
  }

  /**
   * Get test cases template title
   */
  async getTemplateTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  /**
   * Check if any content is visible
   */
  async isContentVisible(): Promise<boolean> {
    return await this.mainContent.count() > 0;
  }

  // Basic Information Methods
  async setTestCaseId(id: string): Promise<void> {
    await this.fillInput(this.testCaseIdInput, id);
  }

  async getTestCaseId(): Promise<string> {
    return await this.getInputValue(this.testCaseIdInput);
  }

  async setTitle(title: string): Promise<void> {
    await this.fillInput(this.titleInput, title);
  }

  async getTitle(): Promise<string> {
    return await this.getInputValue(this.titleInput);
  }

  async setPriority(priority: 'High' | 'Medium' | 'Low'): Promise<void> {
    await this.selectOption(this.prioritySelect, priority);
  }

  async getPriority(): Promise<string> {
    return await this.prioritySelect.inputValue();
  }

  async setTestType(type: string): Promise<void> {
    await this.selectOption(this.testTypeSelect, type);
  }

  async getTestType(): Promise<string> {
    return await this.testTypeSelect.inputValue();
  }

  async setTestLevel(level: string): Promise<void> {
    await this.selectOption(this.testLevelSelect, level);
  }

  async getTestLevel(): Promise<string> {
    return await this.testLevelSelect.inputValue();
  }

  async setTestPhase(phase: string): Promise<void> {
    await this.fillInput(this.testPhaseInput, phase);
  }

  async getTestPhase(): Promise<string> {
    return await this.getInputValue(this.testPhaseInput);
  }

  async setDescription(description: string): Promise<void> {
    await this.fillInput(this.descriptionTextarea, description);
  }

  async getDescription(): Promise<string> {
    return await this.getInputValue(this.descriptionTextarea);
  }

  async setPreconditions(preconditions: string): Promise<void> {
    await this.fillInput(this.preconditionsTextarea, preconditions);
  }

  async getPreconditions(): Promise<string> {
    return await this.getInputValue(this.preconditionsTextarea);
  }

  async setTestData(testData: string): Promise<void> {
    await this.fillInput(this.testDataTextarea, testData);
  }

  async getTestData(): Promise<string> {
    return await this.getInputValue(this.testDataTextarea);
  }

  // Steps Management Methods
  async addStep(): Promise<void> {
    await this.clickElement(this.addStepButton);
  }

  async removeStep(stepIndex: number): Promise<void> {
    const removeButtons = this.removeStepButtons;
    const count = await removeButtons.count();
    if (stepIndex < count) {
      await this.clickElement(removeButtons.nth(stepIndex));
    }
  }

  async setStepDescription(stepIndex: number, description: string): Promise<void> {
    const stepTextareas = this.page.locator('textarea').nth(stepIndex * 2 + 3); // +3 for the first 3 textareas (description, preconditions, testData)
    await this.fillInput(stepTextareas, description);
  }

  async getStepDescription(stepIndex: number): Promise<string> {
    const stepTextareas = this.page.locator('textarea').nth(stepIndex * 2 + 3);
    return await this.getInputValue(stepTextareas);
  }

  async setStepExpectedResult(stepIndex: number, expected: string): Promise<void> {
    const stepTextareas = this.page.locator('textarea').nth(stepIndex * 2 + 4); // +4 for expected result
    await this.fillInput(stepTextareas, expected);
  }

  async getStepExpectedResult(stepIndex: number): Promise<string> {
    const stepTextareas = this.page.locator('textarea').nth(stepIndex * 2 + 4);
    return await this.getInputValue(stepTextareas);
  }

  async getNumberOfSteps(): Promise<number> {
    return await this.removeStepButtons.count();
  }

  // Additional Information Methods
  async setTestEnvironment(environment: string): Promise<void> {
    await this.fillInput(this.testEnvironmentInput, environment);
  }

  async getTestEnvironment(): Promise<string> {
    return await this.getInputValue(this.testEnvironmentInput);
  }

  async setAutomationStatus(status: 'Automated' | 'Not Automated'): Promise<void> {
    await this.selectOption(this.automationStatusSelect, status);
  }

  async getAutomationStatus(): Promise<string> {
    return await this.automationStatusSelect.inputValue();
  }

  async setTestArea(area: string): Promise<void> {
    await this.fillInput(this.testAreaInput, area);
  }

  async getTestArea(): Promise<string> {
    return await this.getInputValue(this.testAreaInput);
  }

  async setTestScriptReference(reference: string): Promise<void> {
    await this.fillInput(this.testScriptReferenceInput, reference);
  }

  async getTestScriptReference(): Promise<string> {
    return await this.getInputValue(this.testScriptReferenceInput);
  }

  async setCreatedBy(creator: string): Promise<void> {
    await this.fillInput(this.createdByInput, creator);
  }

  async getCreatedBy(): Promise<string> {
    return await this.getInputValue(this.createdByInput);
  }

  async setCreationDate(date: string): Promise<void> {
    await this.fillInput(this.creationDateInput, date);
  }

  async getCreationDate(): Promise<string> {
    return await this.getInputValue(this.creationDateInput);
  }

  async setLastUpdated(date: string): Promise<void> {
    await this.fillInput(this.lastUpdatedInput, date);
  }

  async getLastUpdated(): Promise<string> {
    return await this.getInputValue(this.lastUpdatedInput);
  }

  // Related Information Methods
  async setRequirementId(id: string): Promise<void> {
    await this.fillInput(this.requirementIdInput, id);
  }

  async getRequirementId(): Promise<string> {
    return await this.getInputValue(this.requirementIdInput);
  }

  async setUserStoryLink(link: string): Promise<void> {
    await this.fillInput(this.userStoryLinkInput, link);
  }

  async getUserStoryLink(): Promise<string> {
    return await this.getInputValue(this.userStoryLinkInput);
  }

  // Tags Management Methods
  async addTag(tag: string): Promise<void> {
    await this.fillInput(this.newTagInput, tag);
    await this.clickElement(this.addTagButton);
  }

  async removeTag(tagIndex: number): Promise<void> {
    const tagRemoveButtons = this.page.locator('button:has-text("x")');
    const count = await tagRemoveButtons.count();
    if (tagIndex < count) {
      await this.clickElement(tagRemoveButtons.nth(tagIndex));
    }
  }

  async addPredefinedTag(tag: string): Promise<void> {
    const predefinedButton = this.page.locator(`button:has-text("${tag}")`);
    await this.clickElement(predefinedButton);
  }

  async getTags(): Promise<string[]> {
    // Look for spans that contain tag text but not the 'x' button
    const tagSpans = this.page.locator('span');
    const count = await tagSpans.count();
    const tags: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await tagSpans.nth(i).textContent();
      if (text) {
        const cleanText = text.replace('x', '').trim();
        if (['Smoke', 'Regression', 'Sanity', 'Critical'].includes(cleanText)) {
          tags.push(cleanText);
        }
      }
    }
    
    return tags;
  }

  // Export Methods
  async exportToDoc(): Promise<void> {
    await this.clickElement(this.exportToDocButton);
    // Wait for download to start
    await this.page.waitForTimeout(1000);
  }

  async exportToExcel(): Promise<void> {
    await this.clickElement(this.exportToExcelButton);
    // Wait for download to start
    await this.page.waitForTimeout(1000);
  }

  // Form Validation Methods
  async isFormValid(): Promise<boolean> {
    const testCaseId = await this.getTestCaseId();
    const title = await this.getTitle();
    const description = await this.getDescription();
    
    return testCaseId.length > 0 && title.length > 0 && description.length > 0;
  }

  async getValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    const testCaseId = await this.getTestCaseId();
    if (!testCaseId) errors.push('Test Case ID is required');
    
    const title = await this.getTitle();
    if (!title) errors.push('Title is required');
    
    const description = await this.getDescription();
    if (!description) errors.push('Description is required');
    
    return errors;
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