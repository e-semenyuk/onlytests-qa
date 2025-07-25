import { Page, expect } from '@playwright/test';
import { env } from '@config/environment';
import { logger } from './logger';

export class TestUtils {
  /**
   * Wait for element to be visible and clickable
   */
  static async waitForElement(page: Page, selector: string, timeout?: number): Promise<void> {
    const startTime = Date.now();
    try {
      await page.waitForSelector(selector, { 
        state: 'visible', 
        timeout: timeout || env.getTimeout() 
      });
      const duration = Date.now() - startTime;
      logger.logElementInteraction(selector, 'waitForElement', true);
      logger.logPerformanceMetrics('waitForElement', duration);
    } catch (error) {
      logger.logElementInteraction(selector, 'waitForElement', false);
      throw error;
    }
  }

  /**
   * Safe click with retry mechanism
   */
  static async safeClick(page: Page, selector: string, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        const startTime = Date.now();
        await page.click(selector);
        const duration = Date.now() - startTime;
        
        logger.logElementInteraction(selector, 'click', true);
        logger.logPerformanceMetrics('safeClick', duration);
        return;
      } catch (error) {
        logger.logElementInteraction(selector, 'click', false);
        
        if (i === retries - 1) {
          logger.error(`Failed to click element after ${retries} retries: ${selector}`, { 
            action: 'CLICK', 
            retryCount: i + 1, 
            error: error as Error 
          });
          throw error;
        }
        
        logger.logRetry('safeClick', i + 1, error as Error);
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Fill input field with retry mechanism
   */
  static async safeFill(page: Page, selector: string, value: string, retries = 3): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        const startTime = Date.now();
        await page.fill(selector, value);
        const duration = Date.now() - startTime;
        
        logger.logElementInteraction(selector, 'fill', true);
        logger.logPerformanceMetrics('safeFill', duration);
        return;
      } catch (error) {
        logger.logElementInteraction(selector, 'fill', false);
        
        if (i === retries - 1) {
          logger.error(`Failed to fill element after ${retries} retries: ${selector}`, { 
            action: 'FILL', 
            retryCount: i + 1, 
            error: error as Error 
          });
          throw error;
        }
        
        logger.logRetry('safeFill', i + 1, error as Error);
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for page to load completely
   */
  static async waitForPageLoad(page: Page): Promise<void> {
    const startTime = Date.now();
    try {
      await page.waitForLoadState('networkidle');
      const duration = Date.now() - startTime;
      logger.logPerformanceMetrics('waitForPageLoad', duration);
    } catch (error) {
      logger.error('Failed to wait for page load', { 
        action: 'PAGE_LOAD', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const path = `test-results/screenshots/${name}-${timestamp}.png`;
      
      await page.screenshot({ 
        path,
        fullPage: true 
      });
      
      logger.logScreenshotTaken(name, path);
    } catch (error) {
      logger.error('Failed to take screenshot', { 
        action: 'SCREENSHOT', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 8): string {
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
  static generateRandomEmail(): string {
    return `test-${this.generateRandomString()}@example.com`;
  }

  /**
   * Assert element is visible
   */
  static async assertElementVisible(page: Page, selector: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toBeVisible();
      logger.logElementInteraction(selector, 'assertVisible', true);
    } catch (error) {
      logger.logElementInteraction(selector, 'assertVisible', false);
      throw error;
    }
  }

  /**
   * Assert element has text
   */
  static async assertElementHasText(page: Page, selector: string, text: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toHaveText(text);
      logger.logElementInteraction(selector, 'assertHasText', true);
    } catch (error) {
      logger.logElementInteraction(selector, 'assertHasText', false);
      throw error;
    }
  }

  /**
   * Assert element contains text
   */
  static async assertElementContainsText(page: Page, selector: string, text: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toContainText(text);
      logger.logElementInteraction(selector, 'assertContainsText', true);
    } catch (error) {
      logger.logElementInteraction(selector, 'assertContainsText', false);
      throw error;
    }
  }

  /**
   * Assert URL contains path
   */
  static async assertUrlContains(page: Page, path: string): Promise<void> {
    try {
      await expect(page).toHaveURL(new RegExp(path));
      logger.debug(`URL assertion passed: ${path}`, { action: 'URL_ASSERT' });
    } catch (error) {
      logger.error(`URL assertion failed: ${path}`, { 
        action: 'URL_ASSERT', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Wait for network request to complete
   */
  static async waitForNetworkIdle(page: Page, timeout?: number): Promise<void> {
    const startTime = Date.now();
    try {
      await page.waitForLoadState('networkidle', { 
        timeout: timeout || env.getTimeout() 
      });
      const duration = Date.now() - startTime;
      logger.logPerformanceMetrics('waitForNetworkIdle', duration);
    } catch (error) {
      logger.error('Failed to wait for network idle', { 
        action: 'NETWORK_IDLE', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Get element text safely
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    try {
      await this.waitForElement(page, selector);
      const text = await page.locator(selector).textContent() || '';
      logger.logElementInteraction(selector, 'getText', true);
      return text;
    } catch (error) {
      logger.logElementInteraction(selector, 'getText', false);
      throw error;
    }
  }

  /**
   * Check if element exists
   */
  static async elementExists(page: Page, selector: string): Promise<boolean> {
    try {
      await page.waitForSelector(selector, { timeout: 5000 });
      logger.logElementInteraction(selector, 'exists', true);
      return true;
    } catch {
      logger.logElementInteraction(selector, 'exists', false);
      return false;
    }
  }

  /**
   * Navigate to URL with logging
   */
  static async navigateTo(page: Page, url: string): Promise<void> {
    const startTime = Date.now();
    try {
      await page.goto(url);
      const duration = Date.now() - startTime;
      logger.logPageAction('navigate', url, duration);
      logger.logPerformanceMetrics('navigate', duration);
    } catch (error) {
      logger.error(`Failed to navigate to: ${url}`, { 
        action: 'NAVIGATE', 
        pageUrl: url, 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Wait for specific network request
   */
  static async waitForRequest(page: Page, urlPattern: string | RegExp, timeout?: number): Promise<void> {
    const startTime = Date.now();
    try {
      await page.waitForRequest(urlPattern, { timeout: timeout || env.getTimeout() });
      const duration = Date.now() - startTime;
      logger.logNetworkRequest('WAIT', urlPattern.toString(), undefined, duration);
    } catch (error) {
      logger.error(`Failed to wait for request: ${urlPattern}`, { 
        action: 'WAIT_REQUEST', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Wait for specific network response
   */
  static async waitForResponse(page: Page, urlPattern: string | RegExp, timeout?: number): Promise<void> {
    const startTime = Date.now();
    try {
      await page.waitForResponse(urlPattern, { timeout: timeout || env.getTimeout() });
      const duration = Date.now() - startTime;
      logger.logNetworkRequest('WAIT_RESPONSE', urlPattern.toString(), undefined, duration);
    } catch (error) {
      logger.error(`Failed to wait for response: ${urlPattern}`, { 
        action: 'WAIT_RESPONSE', 
        error: error as Error 
      });
      throw error;
    }
  }
} 