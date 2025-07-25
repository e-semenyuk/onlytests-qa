import { Page } from '@playwright/test';
import { env } from '../config/environment';
import { HomePage } from '../pages/home-page';
import { ToolsPage } from '../pages/tools-page';
import { AboutPage } from '../pages/about-page';
import { UserDataPage } from '../pages/tools/user-data-page';
import { TestCasesPage } from '../pages/templates/test-cases-page';

export class PageFactory {
  private static instance: PageFactory;

  private constructor() {}

  /**
   * Singleton pattern for page factory
   */
  public static getInstance(): PageFactory {
    if (!PageFactory.instance) {
      PageFactory.instance = new PageFactory();
    }
    return PageFactory.instance;
  }

  /**
   * Create home page instance
   */
  public createHomePage(page: Page): HomePage {
    return new HomePage(page, env.getBaseUrl());
  }

  /**
   * Create tool page instance
   */
  public createToolPage(page: Page): ToolsPage {
    return new ToolsPage(page, env.getBaseUrl());
  }

  /**
   * Create about page instance
   */
  public createAboutPage(page: Page): AboutPage {
    return new AboutPage(page, env.getBaseUrl());
  }

  /**
   * Create user data page instance
   */
  public createUserDataPage(page: Page): UserDataPage {
    return new UserDataPage(page, env.getBaseUrl());
  }

  /**
   * Create test cases page instance
   */
  public createTestCasesPage(page: Page): TestCasesPage {
    return new TestCasesPage(page, env.getBaseUrl());
  }

  /**
   * Create all page instances
   */
  public createAllPages(page: Page) {
    return {
      homePage: this.createHomePage(page),
      toolPage: this.createToolPage(page),
      aboutPage: this.createAboutPage(page),
      userDataPage: this.createUserDataPage(page),
      testCasesPage: this.createTestCasesPage(page),
    };
  }
} 