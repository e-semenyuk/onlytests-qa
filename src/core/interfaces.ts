import { Page } from '@playwright/test';
import { EnvironmentConfig } from '../config/environment';

// Base Page Interface - Only one interface needed for all pages
export interface IBasePage {
  readonly page: Page;
  navigate(): Promise<void>;
  waitForPageLoad(): Promise<void>;
  getPageTitle(): Promise<string>;
  getCurrentUrl(): Promise<string>;
  getPageContent(): Promise<string>;
  isContentVisible(): Promise<boolean>;
}

// Test Data Interfaces
export interface ITestData {
  urls: {
    home: string;
    about: string;
    tools: Record<string, string>;
    templates: Record<string, string>;
  };
  expectedContent: {
    titles: Record<string, string>;
    sections: string[];
  };
}

// Configuration Interface - Using centralized EnvironmentConfig
export type ITestConfig = EnvironmentConfig;

// API Client Interfaces
export interface IApiClient {
  baseUrl: string;
  authToken?: string;
  
  setAuthToken(token: string): void;
  clearAuthToken(): void;
  
  get<T>(endpoint: string, headers?: Record<string, string>): Promise<T>;
  post<T>(endpoint: string, data: Record<string, unknown>, headers?: Record<string, string>): Promise<T>;
  put<T>(endpoint: string, data: Record<string, unknown>, headers?: Record<string, string>): Promise<T>;
  delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T>;
  
  authenticate(username: string, password: string): Promise<string>;
}

// Test Utilities Interfaces
export interface ITestUtils {
  waitForElement(page: Page, selector: string, timeout?: number): Promise<void>;
  safeClick(page: Page, selector: string, retries?: number): Promise<void>;
  safeFill(page: Page, selector: string, value: string, retries?: number): Promise<void>;
  waitForPageLoad(page: Page): Promise<void>;
  takeScreenshot(page: Page, name: string): Promise<void>;
  generateRandomString(length?: number): string;
  generateRandomEmail(): string;
  assertElementVisible(page: Page, selector: string): Promise<void>;
  assertElementHasText(page: Page, selector: string, text: string): Promise<void>;
  assertElementContainsText(page: Page, selector: string, text: string): Promise<void>;
  assertUrlContains(page: Page, path: string): Promise<void>;
  waitForNetworkIdle(page: Page, timeout?: number): Promise<void>;
  getElementText(page: Page, selector: string): Promise<string>;
  elementExists(page: Page, selector: string): Promise<boolean>;
} 