import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export type EnvironmentConfig = {
  baseUrl: string;
  apiUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
  traceOnFailure: boolean;
  parallel: boolean;
  workers: number;
};

// Environment-specific configuration interfaces
interface BaseConfig {
  baseUrl: string;
  apiUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
  screenshotOnFailure: boolean;
  videoOnFailure: boolean;
  traceOnFailure: boolean;
  parallel: boolean;
  workers: number;
}

export class Environment {
  private static instance: Environment;
  private config: EnvironmentConfig;
  private readonly logger: typeof console;

  private constructor() {
    this.logger = console;
    this.config = this.loadConfig();
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  private loadConfig(): EnvironmentConfig {
    const env = process.env.NODE_ENV || 'local';
    this.logger.info(`Loading configuration for environment: ${env}`);

    try {
      // Load base configuration
      const baseConfig = this.loadBaseConfig(env);
      
      // Basic validation (without zod to avoid Playwright config loading issues)
      this.validateConfig(baseConfig);
      
      this.logger.info('Configuration loaded successfully');
      return baseConfig;
    } catch (error) {
      this.logger.error('Failed to load configuration:', error);
      throw new Error(`Configuration loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateConfig(config: EnvironmentConfig): void {
    // Basic validation without external dependencies
    if (!config.baseUrl || !config.baseUrl.startsWith('http')) {
      throw new Error('Base URL must be a valid URL starting with http');
    }
    if (!config.apiUrl || !config.apiUrl.startsWith('http')) {
      throw new Error('API URL must be a valid URL starting with http');
    }
    if (config.timeout < 1000 || config.timeout > 300000) {
      throw new Error('Timeout must be between 1000ms and 300000ms');
    }
    if (config.retries < 0 || config.retries > 10) {
      throw new Error('Retries must be between 0 and 10');
    }
    if (config.workers < 1 || config.workers > 10) {
      throw new Error('Workers must be between 1 and 10');
    }
  }

  private loadBaseConfig(env: string): BaseConfig {
    const configs: Record<string, BaseConfig> = {
      local: {
        baseUrl: process.env.LOCAL_BASE_URL || 'http://localhost:3000',
        apiUrl: process.env.LOCAL_API_URL || 'http://localhost:3000/api',
        timeout: parseInt(process.env.TIMEOUT || '30000'),
        retries: parseInt(process.env.RETRIES || '2'),
        headless: process.env.HEADLESS !== 'false',
        screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
        videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
        traceOnFailure: process.env.TRACE_ON_FAILURE !== 'false',
        parallel: process.env.PARALLEL !== 'false',
        workers: parseInt(process.env.WORKERS || '4'),
      },
      prod: {
        baseUrl: process.env.PROD_BASE_URL || 'https://onlytests.io',
        apiUrl: process.env.PROD_API_URL || 'https://onlytests.io/api',
        timeout: parseInt(process.env.TIMEOUT || '30000'),
        retries: parseInt(process.env.RETRIES || '2'),
        headless: process.env.HEADLESS !== 'false',
        screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
        videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
        traceOnFailure: process.env.TRACE_ON_FAILURE !== 'false',
        parallel: process.env.PARALLEL !== 'false',
        workers: parseInt(process.env.WORKERS || '1'),
      }
    };

    return configs[env] || configs.local;
  }

  public getConfig(): EnvironmentConfig {
    return this.config;
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  public getApiUrl(): string {
    return this.config.apiUrl;
  }

  public getTimeout(): number {
    return this.config.timeout;
  }

  public getRetries(): number {
    return this.config.retries;
  }

  public isHeadless(): boolean {
    return this.config.headless;
  }

  public shouldTakeScreenshotOnFailure(): boolean {
    return this.config.screenshotOnFailure;
  }

  public shouldRecordVideoOnFailure(): boolean {
    return this.config.videoOnFailure;
  }

  public shouldTraceOnFailure(): boolean {
    return this.config.traceOnFailure;
  }

  public isParallel(): boolean {
    return this.config.parallel;
  }

  public getWorkers(): number {
    return this.config.workers;
  }

  public getEnvironment(): string {
    return process.env.NODE_ENV || 'local';
  }

  public isProduction(): boolean {
    return this.getEnvironment() === 'prod';
  }

  public isLocal(): boolean {
    return this.getEnvironment() === 'local';
  }

  public isCI(): boolean {
    return process.env.CI === 'true';
  }

  // Method to update configuration at runtime (useful for testing)
  public updateConfig(updates: Partial<EnvironmentConfig>): void {
    this.config = { ...this.config, ...updates };
    this.logger.info('Configuration updated:', updates);
  }

  // Method to reset configuration to original values
  public resetConfig(): void {
    this.config = this.loadConfig();
    this.logger.info('Configuration reset to original values');
  }
}

export const env = Environment.getInstance(); 