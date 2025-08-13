import { Page, expect } from '@playwright/test';
import { TextGeneratorPage } from '../pages/text-generator-page';

export class TextGeneratorTestUtils {
  private page: Page;
  private textGeneratorPage: TextGeneratorPage;

  constructor(page: Page) {
    this.page = page;
    this.textGeneratorPage = new TextGeneratorPage(page);
  }

  /**
   * Generate test data for different scenarios
   */
  static getTestData() {
    return {
      characterCounts: [10, 25, 50, 100, 200],
      wordCounts: [5, 10, 25, 50, 100],
      invalidInputs: ['abc', '-10', '0', '1000.5', ''],
      boundaryValues: [1, 999, 1000]
    };
  }

  /**
   * Wait for text generation and validate the result
   */
  async waitForTextGenerationAndValidate(
    expectedLength: number, 
    unit: 'characters' | 'words'
  ): Promise<string> {
    await this.textGeneratorPage.waitForTextGeneration();
    const generatedText = await this.textGeneratorPage.getGeneratedText();
    
    if (unit === 'characters') {
      expect(generatedText.length).toBeGreaterThanOrEqual(expectedLength * 0.8);
      expect(generatedText.length).toBeLessThanOrEqual(expectedLength * 1.2);
    } else {
      const wordCount = generatedText.trim().split(/\s+/).length;
      expect(wordCount).toBe(expectedLength);
    }
    
    return generatedText;
  }

  /**
   * Test copy to clipboard functionality with dialog handling
   */
  async testCopyToClipboard(): Promise<void> {
    // Set up dialog handler
    this.page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('Copied to clipboard!');
      await dialog.accept();
    });
    
    await this.textGeneratorPage.copyToClipboard();
  }

  /**
   * Test rapid parameter changes
   */
  async testRapidParameterChanges(): Promise<void> {
    const testCases = [
      { number: 10, unit: 'characters' as const },
      { number: 25, unit: 'words' as const },
      { number: 50, unit: 'characters' as const },
      { number: 15, unit: 'words' as const }
    ];

    for (const testCase of testCases) {
      await this.textGeneratorPage.generateTextWithParameters(
        testCase.number, 
        testCase.unit
      );
      await this.waitForTextGenerationAndValidate(testCase.number, testCase.unit);
    }
  }

  /**
   * Test accessibility features
   */
  async testAccessibility(): Promise<void> {
    // Test keyboard navigation
    await this.page.keyboard.press('Tab');
    await expect(this.textGeneratorPage['numberInput']).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.textGeneratorPage['charactersRadio']).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.textGeneratorPage['wordsRadio']).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.textGeneratorPage['countSpacesCheckbox']).toBeFocused();
    
    await this.page.keyboard.press('Tab');
    await expect(this.textGeneratorPage['copyToClipboardButton']).toBeFocused();
  }

  /**
   * Test performance with timing
   */
  async testPerformance(iterations: number = 5): Promise<number[]> {
    const timings: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      await this.textGeneratorPage.generateTextWithParameters(25, 'words');
      const endTime = Date.now();
      timings.push(endTime - startTime);
    }
    
    return timings;
  }

  /**
   * Validate generated text quality
   */
  async validateTextQuality(generatedText: string): Promise<void> {
    // Check that text is not empty
    expect(generatedText.length).toBeGreaterThan(0);
    
    // Check that text contains typical Lorem Ipsum words
    const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing'];
    const lowerText = generatedText.toLowerCase();
    const hasLoremWords = loremWords.some(word => lowerText.includes(word));
    expect(hasLoremWords).toBe(true);
    
    // Check that text has proper spacing
    expect(generatedText).toMatch(/\s+/);
    
    // Check that text doesn't have excessive whitespace
    expect(generatedText).not.toMatch(/\s{3,}/);
  }

  /**
   * Test error scenarios
   */
  async testErrorScenarios(): Promise<void> {
    // Test invalid input
    await this.textGeneratorPage.setNumber(-10);
    const inputValue = await this.textGeneratorPage.getNumberValue();
    expect(inputValue).not.toBe('-10');
    
    // Test zero input
    await this.textGeneratorPage.setNumber(0);
    await this.textGeneratorPage.waitForTextGeneration();
    const generatedText = await this.textGeneratorPage.getGeneratedText();
    expect(generatedText).toBeDefined();
  }

  /**
   * Get the text generator page instance
   */
  getTextGeneratorPage(): TextGeneratorPage {
    return this.textGeneratorPage;
  }
} 