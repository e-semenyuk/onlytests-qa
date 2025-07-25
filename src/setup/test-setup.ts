import { ConfigValidator } from '../utils/config-validator';
import { logger } from '../utils/logger';
import { env } from '../config/environment';

export class TestSetup {
  private static isInitialized = false;

  /**
   * Initialize test environment
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.info('Test environment already initialized');
      return;
    }

    try {
      logger.info('Initializing test environment...');

      // Validate configuration
      await this.validateConfiguration();

      // Log environment information
      this.logEnvironmentInfo();

      // Validate security settings
      this.validateSecuritySettings();

      // Set up test directories
      await this.setupTestDirectories();

      // Initialize performance monitoring
      this.initializePerformanceMonitoring();

      this.isInitialized = true;
      logger.info('Test environment initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize test environment', { 
        action: 'INIT', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Validate all configuration settings
   */
  private static async validateConfiguration(): Promise<void> {
    logger.info('Validating configuration...');
    
    try {
      ConfigValidator.validateAll();
      logger.info('Configuration validation completed successfully');
    } catch (error) {
      logger.error('Configuration validation failed', { 
        action: 'CONFIG_VALIDATION', 
        error: error as Error 
      });
      throw error;
    }
  }

  /**
   * Log environment information
   */
  private static logEnvironmentInfo(): void {
    logger.logEnvironmentInfo();
    logger.logConfiguration();
    
    const summary = ConfigValidator.getConfigurationSummary();
    logger.info('Configuration summary:', { 
      action: 'CONFIG_SUMMARY', 
      pageUrl: JSON.stringify(summary, null, 2) 
    });
  }

  /**
   * Validate security settings
   */
  private static validateSecuritySettings(): void {
    logger.info('Validating security settings...');
    
    const config = env.getConfig();

    // Check for HTTP in production
    if (env.isProduction() && config.baseUrl.startsWith('http://')) {
      logger.logSecurityWarning('Using HTTP in production environment');
    }

    logger.info('Security validation completed');
  }

  /**
   * Set up test directories
   */
  private static async setupTestDirectories(): Promise<void> {
    logger.info('Setting up test directories...');
    
    const fs = require('fs').promises;

    const directories = [
      'test-results',
      'test-results/screenshots',
      'test-results/videos',
      'test-results/traces',
      'test-results/logs'
    ];

    for (const dir of directories) {
      try {
        await fs.mkdir(dir, { recursive: true });
        logger.debug(`Created directory: ${dir}`);
      } catch (error) {
        // Directory might already exist, which is fine
        logger.debug(`Directory already exists: ${dir}`);
      }
    }

    logger.info('Test directories setup completed');
  }

  /**
   * Initialize performance monitoring
   */
  private static initializePerformanceMonitoring(): void {
    logger.info('Initializing performance monitoring...');
    
    // Set up global performance monitoring
    if (typeof global !== 'undefined') {
      (global as Record<string, unknown>).testStartTime = Date.now();
      (global as Record<string, unknown>).testMetrics = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        totalDuration: 0,
        averageDuration: 0
      };
    }

    logger.info('Performance monitoring initialized');
  }

  /**
   * Get test metrics
   */
  static getTestMetrics(): Record<string, unknown> | null {
    if (typeof global !== 'undefined' && (global as Record<string, unknown>).testMetrics) {
      return (global as Record<string, unknown>).testMetrics as Record<string, unknown>;
    }
    return null;
  }

  /**
   * Update test metrics
   */
  static updateTestMetrics(testName: string, success: boolean, duration: number): void {
    if (typeof global !== 'undefined' && (global as Record<string, unknown>).testMetrics) {
      const metrics = (global as Record<string, unknown>).testMetrics as Record<string, unknown>;
      metrics.totalTests = (metrics.totalTests as number || 0) + 1;
      metrics.totalDuration = (metrics.totalDuration as number || 0) + duration;
      
      if (success) {
        metrics.passedTests = (metrics.passedTests as number || 0) + 1;
      } else {
        metrics.failedTests = (metrics.failedTests as number || 0) + 1;
      }
      
      const totalTests = metrics.totalTests as number;
      const totalDuration = metrics.totalDuration as number;
      metrics.averageDuration = totalDuration / totalTests;
      
      logger.debug(`Updated test metrics for: ${testName}`, { 
        action: 'METRICS_UPDATE', 
        duration 
      });
    }
  }

  /**
   * Log final test summary
   */
  static logTestSummary(): void {
    const metrics = this.getTestMetrics();
    if (metrics) {
      logger.info('Test execution summary:', {
        action: 'TEST_SUMMARY',
        pageUrl: JSON.stringify({
          totalTests: metrics.totalTests,
          passedTests: metrics.passedTests,
          failedTests: metrics.failedTests,
          successRate: `${(((metrics.passedTests as number) / (metrics.totalTests as number)) * 100).toFixed(2)}%`,
          totalDuration: `${metrics.totalDuration}ms`,
          averageDuration: `${(metrics.averageDuration as number).toFixed(2)}ms`
        }, null, 2)
      });
    }
  }

  /**
   * Clean up test environment
   */
  static async cleanup(): Promise<void> {
    logger.info('Cleaning up test environment...');
    
    // Log final summary
    this.logTestSummary();
    
    // Reset initialization flag
    this.isInitialized = false;
    
    logger.info('Test environment cleanup completed');
  }

  /**
   * Check if environment is ready for testing
   */
  static isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get environment status
   */
  static getEnvironmentStatus(): Record<string, unknown> {
    return {
      initialized: this.isInitialized,
      environment: env.getEnvironment(),
      baseUrl: env.getBaseUrl(),
      isCI: env.isCI(),
      isProduction: env.isProduction(),
      isLocal: env.isLocal(),
      headless: env.isHeadless(),
      parallel: env.isParallel(),
      workers: env.getWorkers(),
      timeout: env.getTimeout(),
      retries: env.getRetries()
    };
  }
} 