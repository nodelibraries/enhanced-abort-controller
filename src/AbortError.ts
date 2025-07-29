/**
 * Error thrown when an operation is aborted.
 * 
 * This error is thrown when an operation is cancelled or aborted,
 * typically through an EnhancedAbortSignal.
 * 
 * @example
 * ```typescript
 * const controller = new EnhancedAbortController();
 * 
 * try {
 *   controller.signal.throwIfAborted();
 *   // Continue with work...
 * } catch (error) {
 *   if (error instanceof AbortError) {
 *     console.log('Operation was aborted:', error.message);
 *   }
 * }
 * ```
 */
export class AbortError extends Error {
  /**
   * Creates a new AbortError instance.
   * 
   * @param message - Optional error message. Defaults to 'The operation was aborted.'
   * 
   * @example
   * ```typescript
   * // With default message
   * const error1 = new AbortError();
   * console.log(error1.message); // 'The operation was aborted.'
   * 
   * // With custom message
   * const error2 = new AbortError('User cancelled the operation');
   * console.log(error2.message); // 'User cancelled the operation'
   * ```
   */
  constructor(message = 'The operation was aborted.') {
    super(message);
    this.name = 'AbortError';
  }
}
