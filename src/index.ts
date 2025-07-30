/**
 * Enhanced Abort Controller Library
 *
 * A TypeScript library providing enhanced AbortController functionality
 * with Node.js-style patterns for modern applications.
 *
 * This library exports the following main classes:
 * - {@link EnhancedAbortController} - Enhanced abort controller with timeout and disposal support
 * - {@link EnhancedAbortSignal} - Enhanced abort signal with registration and promise support
 * - {@link AbortError} - Error thrown when operations are aborted
 * - {@link AbortRegistration} - Registration for abort signal callbacks
 * - {@link TimeSpan} - Time interval representation for precise time management
 *
 * @example
 * ```typescript
 * import {
 *   EnhancedAbortController,
 *   EnhancedAbortSignal,
 *   AbortError,
 *   TimeSpan
 * } from 'enhanced-abort-controller';
 *
 * // Create a controller with timeout
 * const controller = new EnhancedAbortController();
 * controller.abortAfter(5000); // Abort after 5 seconds
 *
 * // Use in async operations
 * async function doWork(signal: EnhancedAbortSignal) {
 *   for (let i = 0; i < 10; i++) {
 *     signal.throwIfAborted();
 *     console.log(`Working... ${i}`);
 *     await new Promise(resolve => setTimeout(resolve, 1000));
 *   }
 * }
 *
 * doWork(controller.signal).catch(err => {
 *   if (err instanceof AbortError) {
 *     console.log('Operation was aborted');
 *   }
 * });
 * ```
 *
 * @packageDocumentation
 */

// Main exports
export { EnhancedAbortController } from './EnhancedAbortController';
export { EnhancedAbortSignal } from './EnhancedAbortSignal';
export { AbortError } from './AbortError';
export { AbortRegistration } from './AbortRegistration';
export { TimeSpan } from './TimeSpan';
