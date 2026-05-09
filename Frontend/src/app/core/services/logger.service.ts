import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/logs`;

  // In production, you might want to disable debug logs
  private isProduction = environment.production;

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: Record<string, any>): void {
    if (!this.isProduction) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);

    // In production, you might want to send errors to a monitoring service
    if (this.isProduction) {
      this.sendToServer(LogLevel.ERROR, message, context, error);
    }
  }

  /**
   * Log a message to the console and optionally to the server
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Always log to console for now
    this.logToConsole(entry);
  }

  /**
   * Log to the browser console with proper formatting
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.context || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.error || '', entry.context || '');
        break;
    }
  }

  /**
   * Send error logs to the server for monitoring (optional)
   */
  private sendToServer(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
  ): void {
    // Only send errors to server in production
    if (level !== LogLevel.ERROR) {
      return;
    }

    const payload = {
      level,
      message,
      context,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Send to server without blocking
    this.http.post(`${this.apiUrl}/client-errors`, payload).subscribe({
      error: () => {
        // Silently fail if server logging fails
      },
    });
  }
}
