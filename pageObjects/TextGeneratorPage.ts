import { Page } from '@playwright/test';

export class TextGeneratorPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('https://www.onlytests.io/tools/text-generator');
  }

  async enterCount(value: number) {
    await this.page.fill('input[name="count"]', value.toString());
  }

  async getGeneratedText() {
    return await this.page.textContent('textarea[name="generatedText"]');
  }
}
