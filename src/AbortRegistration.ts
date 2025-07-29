/**
 * Represents a registration for an abort signal callback.
 * 
 * This class provides a way to manage callback registrations for abort signals,
 * allowing for proper cleanup and disposal of resources.
 * 
 * @example
 * ```typescript
 * const controller = new EnhancedAbortController();
 * 
 * const registration = controller.signal.register(() => {
 *   console.log('Operation was aborted!');
 * });
 * 
 * // Later, unregister the callback
 * registration.unregister();
 * 
 * // Or dispose the registration
 * registration.dispose();
 * ```
 */
export class AbortRegistration {
  private disposed = false;
  private unregisterCallback?: () => void;

  /**
   * Creates a new AbortRegistration instance.
   * 
   * @param unregisterCallback - The callback to execute when unregistering
   * 
   * @example
   * ```typescript
   * const registration = new AbortRegistration(() => {
   *   console.log('Unregistering callback');
   * });
   * ```
   */
  constructor(unregisterCallback: () => void) {
    this.unregisterCallback = unregisterCallback;
  }

  /**
   * Unregisters the callback from the abort signal.
   * 
   * This method calls the unregister callback and marks the registration as disposed.
   * Subsequent calls to unregister or dispose will have no effect.
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * 
   * const registration = controller.signal.register(() => {
   *   console.log('Aborted!');
   * });
   * 
   * // Unregister the callback
   * registration.unregister();
   * 
   * // Subsequent calls have no effect
   * registration.unregister(); // No-op
   * ```
   */
  unregister(): void {
    if (!this.disposed && this.unregisterCallback) {
      this.unregisterCallback();
      this.unregisterCallback = undefined;
      this.disposed = true;
    }
  }

  /**
   * Disposes the registration and unregisters the callback.
   * 
   * This method is equivalent to calling unregister().
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * 
   * const registration = controller.signal.register(() => {
   *   console.log('Aborted!');
   * });
   * 
   * // Dispose the registration
   * registration.dispose();
   * 
   * // Subsequent calls have no effect
   * registration.dispose(); // No-op
   * ```
   */
  dispose(): void {
    this.unregister();
  }

  /**
   * Gets whether the registration has been disposed.
   * 
   * @returns True if the registration has been disposed, false otherwise
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * 
   * const registration = controller.signal.register(() => {
   *   console.log('Aborted!');
   * });
   * 
   * console.log(registration.isDisposed); // false
   * 
   * registration.unregister();
   * console.log(registration.isDisposed); // true
   * ```
   */
  get isDisposed(): boolean {
    return this.disposed;
  }
} 