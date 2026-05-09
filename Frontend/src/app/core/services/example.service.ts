import { Injectable } from '@angular/core';

/**
 * Example Service
 *
 * A simple service demonstrating basic Angular service patterns.
 * This service provides utility methods for common operations.
 */
@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  constructor() {}

  /**
   * Returns a greeting message.
   *
   * @returns A greeting string
   */
  getGreeting(): string {
    return 'Hello, World!';
  }
}
