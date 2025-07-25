import { env } from '../config/environment';

export class ConfigValidator {
  private static readonly logger = console;

  /**
   * Validate all required environment variables are set
   */
  static validateEnvironment(): void {
    this.logger.info('Validating environment configuration...');

    const currentEnv = env.getEnvironment();
    const requiredVars = [
      `${currentEnv.toUpperCase()}_BASE_URL`,
      `${currentEnv.toUpperCase()}_API_URL`
    ];

    const missingVars: string[] = [];

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.logger.info('Environment configuration validation passed');
  }

  /**
   * Validate configuration values are within acceptable ranges
   */
  static validateConfiguration(): void {
    this.logger.info('Validating configuration values...');

    const config = env.getConfig();

    // Validate timeout
    if (config.timeout < 1000 || config.timeout > 300000) {
      throw new Error(`Timeout must be between 1000ms and 300000ms, got: ${config.timeout}`);
    }

    // Validate retries
    if (config.retries < 0 || config.retries > 10) {
      throw new Error(`Retries must be between 0 and 10, got: ${config.retries}`);
    }

    // Validate workers
    if (config.workers < 1 || config.workers > 10) {
      throw new Error(`Workers must be between 1 and 10, got: ${config.workers}`);
    }

    // Validate URLs
    try {
      new URL(config.baseUrl);
      new URL(config.apiUrl);
    } catch (error) {
      throw new Error(`Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    this.logger.info('Configuration values validation passed');
  }

  /**
   * Validate security settings
   */
  static validateSecurity(): void {
    this.logger.info('Validating security configuration...');

    const config = env.getConfig();

    // Check for HTTP in production
    if (env.isProduction() && config.baseUrl.startsWith('http://')) {
      this.logger.warn('Using HTTP in production environment. Consider using HTTPS.');
    }

    this.logger.info('Security configuration validation passed');
  }

  /**
   * Run all validations
   */
  static validateAll(): void {
    try {
      this.validateEnvironment();
      this.validateConfiguration();
      this.validateSecurity();
      this.logger.info('All configuration validations passed successfully');
    } catch (error) {
      this.logger.error('Configuration validation failed:', error);
      throw error;
    }
  }

  /**
   * Get configuration summary
   */
  static getConfigurationSummary(): Record<string, unknown> {
    const config = env.getConfig();
    
    return {
      environment: env.getEnvironment(),
      baseUrl: config.baseUrl,
      apiUrl: config.apiUrl,
      timeout: config.timeout,
      retries: config.retries,
      headless: config.headless,
      parallel: config.parallel,
      workers: config.workers,
      screenshotOnFailure: config.screenshotOnFailure,
      videoOnFailure: config.videoOnFailure,
      traceOnFailure: config.traceOnFailure,
      isCI: env.isCI(),
      isProduction: env.isProduction(),
      isLocal: env.isLocal(),
    };
  }
} 