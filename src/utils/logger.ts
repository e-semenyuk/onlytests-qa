import { env } from '../config/environment';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export interface LogContext {
  testName?: string;
  pageUrl?: string;
  action?: string;
  duration?: number;
  retryCount?: number;
  error?: Error;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private enableDebugLogs: boolean;

  private constructor() {
    this.logLevel = this.getLogLevelFromEnv();
    this.enableDebugLogs = process.env.ENABLE_DEBUG_LOGS === 'true';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getLogLevelFromEnv(): LogLevel {
    const level = process.env.LOG_LEVEL?.toLowerCase() || 'info';
    switch (level) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      case 'none': return LogLevel.NONE;
      default: return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const env = process.env.NODE_ENV || 'development';
    const parts = [`[${timestamp}] [${level.toUpperCase()}] [${env}]`];

    if (context?.testName) {
      parts.push(`[${context.testName}]`);
    }

    if (context?.action) {
      parts.push(`[${context.action}]`);
    }

    if (context?.duration) {
      parts.push(`[${context.duration}ms]`);
    }

    if (context?.retryCount !== undefined) {
      parts.push(`[Retry: ${context.retryCount}]`);
    }

    parts.push(message);

    if (context?.pageUrl) {
      parts.push(`(URL: ${context.pageUrl})`);
    }

    if (context?.error) {
      parts.push(`(Error: ${context.error.message})`);
    }

    return parts.join(' ');
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel && (level !== LogLevel.DEBUG || this.enableDebugLogs);
  }

  public debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  public info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  public warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  public error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('error', message, context));
    }
  }

  public logTestStart(testName: string): void {
    this.info(`Test started: ${testName}`, { testName });
  }

  public logTestEnd(testName: string, duration: number, success: boolean): void {
    const status = success ? 'PASSED' : 'FAILED';
    this.info(`Test ${status}: ${testName}`, { 
      testName, 
      duration,
      action: success ? 'PASS' : 'FAIL'
    });
  }

  public logPageAction(action: string, pageUrl: string, duration?: number): void {
    this.debug(`Page action: ${action}`, { 
      action, 
      pageUrl, 
      duration 
    });
  }

  public logRetry(action: string, retryCount: number, error?: Error): void {
    this.warn(`Retrying action: ${action}`, { 
      action, 
      retryCount, 
      error 
    });
  }

  public logConfiguration(): void {
    const config = env.getConfig();
    this.info('Configuration loaded', {
      action: 'CONFIG',
      pageUrl: config.baseUrl
    });
  }

  public logEnvironmentInfo(): void {
    this.info(`Environment: ${env.getEnvironment()}`, { action: 'ENV' });
    this.info(`CI Mode: ${env.isCI()}`, { action: 'ENV' });
    this.info(`Headless: ${env.isHeadless()}`, { action: 'ENV' });
    this.info(`Parallel: ${env.isParallel()}`, { action: 'ENV' });
    this.info(`Workers: ${env.getWorkers()}`, { action: 'ENV' });
  }

  public logPerformanceMetrics(operation: string, duration: number): void {
    this.debug(`Performance: ${operation} took ${duration}ms`, { 
      action: operation, 
      duration 
    });
  }

  public logSecurityWarning(message: string): void {
    this.warn(`Security: ${message}`, { action: 'SECURITY' });
  }

  public logNetworkRequest(method: string, url: string, status?: number, duration?: number): void {
    this.debug(`Network: ${method} ${url} ${status || ''}`, { 
      action: 'NETWORK', 
      pageUrl: url, 
      duration 
    });
  }

  public logElementInteraction(selector: string, action: string, success: boolean): void {
    this.debug(`Element: ${action} on ${selector} - ${success ? 'SUCCESS' : 'FAILED'}`, { 
      action: 'ELEMENT' 
    });
  }

  public logScreenshotTaken(name: string, path: string): void {
    this.info(`Screenshot taken: ${name}`, { 
      action: 'SCREENSHOT', 
      pageUrl: path 
    });
  }

  public logVideoRecorded(name: string, path: string): void {
    this.info(`Video recorded: ${name}`, { 
      action: 'VIDEO', 
      pageUrl: path 
    });
  }
}

export const logger = Logger.getInstance(); 