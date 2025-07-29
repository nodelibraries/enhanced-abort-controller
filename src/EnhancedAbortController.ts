import { EnhancedAbortSignal } from './EnhancedAbortSignal';
import { TimeSpan } from './TimeSpan';

/**
 * Enhanced AbortController with .NET Core CancellationToken-inspired patterns.
 * 
 * This class provides an enhanced version of the native AbortController with additional
 * features like timeout-based cancellation, linked controllers, and disposal patterns.
 * 
 * @example
 * ```typescript
 * const controller = new EnhancedAbortController();
 * 
 * // Abort after 5 seconds
 * controller.abortAfter(5000);
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
 */
export class EnhancedAbortController {
  private controller: AbortController;
  private _signal: EnhancedAbortSignal;
  private timeoutId?: NodeJS.Timeout;
  private disposed = false;

  /**
   * Creates a new EnhancedAbortController instance.
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * ```
   */
  constructor() {
    this.controller = new AbortController();
    this._signal = new EnhancedAbortSignal(this.controller.signal);
  }

  /**
   * Gets the abort signal associated with this controller.
   * 
   * @returns The EnhancedAbortSignal instance
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * const signal = controller.signal;
   * signal.register(() => console.log('Aborted!'));
   * ```
   */
  get signal(): EnhancedAbortSignal {
    return this._signal;
  }

  /**
   * Gets the abort signal (equivalent to CancellationTokenSource.Token in .NET).
   * 
   * @returns The EnhancedAbortSignal instance
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * const token = controller.token;
   * ```
   */
  get token(): EnhancedAbortSignal {
    return this._signal;
  }

  /**
   * Gets whether the controller has been aborted.
   * 
   * @returns True if the controller has been aborted, false otherwise
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * console.log(controller.isAborted); // false
   * controller.abort();
   * console.log(controller.isAborted); // true
   * ```
   */
  get isAborted(): boolean {
    return this.controller.signal.aborted;
  }

  /**
   * Gets whether the controller has been disposed.
   * 
   * @returns True if the controller has been disposed, false otherwise
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * console.log(controller.isDisposed); // false
   * controller.dispose();
   * console.log(controller.isDisposed); // true
   * ```
   */
  get isDisposed(): boolean {
    return this.disposed;
  }

  /**
   * Gets the abort reason.
   * 
   * @returns The reason for the abort, or undefined if not aborted
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * controller.abort('User cancelled');
   * console.log(controller.reason); // 'User cancelled'
   * ```
   */
  get reason(): any {
    return this.controller.signal.reason;
  }

  /**
   * Aborts the controller immediately.
   * 
   * @param reason - Optional reason for the abort
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * controller.abort('Manual cancellation');
   * ```
   */
  abort(reason?: any): void {
    if (this.disposed) return;

    this.clearTimeout();
    this.controller.abort(reason);
  }

  /**
   * Aborts the controller after a specified delay.
   * 
   * @param ms - Milliseconds to wait before aborting
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * controller.abortAfter(5000); // Abort after 5 seconds
   * ```
   */
  abortAfter(ms: number): void {
    if (this.disposed) return;

    this.clearTimeout();
    this.timeoutId = setTimeout(() => this.abort(), ms);
  }

  /**
   * Aborts the controller after a specified delay using TimeSpan.
   * 
   * @param timeSpan - TimeSpan object representing the delay
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * const timeSpan = TimeSpan.fromSeconds(5);
   * controller.abortAfterTimeSpan(timeSpan);
   * ```
   */
  abortAfterTimeSpan(timeSpan: TimeSpan): void {
    this.abortAfter(timeSpan.milliseconds);
  }

  /**
   * Disposes the controller and cleans up resources.
   * After disposal, the controller cannot be used for new operations.
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * // ... use controller
   * controller.dispose();
   * ```
   */
  dispose(): void {
    if (this.disposed) return;

    this.disposed = true;
    this.clearTimeout();
  }

  /**
   * Tries to reset the controller (creates a new one).
   * Note: This creates a new controller since AbortController cannot be reset.
   * 
   * @returns True if reset was successful, false if controller is disposed
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * controller.abort();
   * const resetSuccess = controller.tryReset();
   * console.log(resetSuccess); // true
   * console.log(controller.isAborted); // false
   * ```
   */
  tryReset(): boolean {
    if (this.disposed) return false;

    this.clearTimeout();
    this.controller = new AbortController();
    this._signal = new EnhancedAbortSignal(this.controller.signal);
    return true;
  }

  /**
   * Clears the current timeout if one is set.
   */
  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  /**
   * Creates a controller that is linked to multiple signals.
   * The linked controller will abort when any of the provided signals abort.
   * 
   * @param signals - The signals to link
   * @returns A new controller that aborts when any of the signals abort
   * 
   * @example
   * ```typescript
   * const controller1 = new EnhancedAbortController();
   * const controller2 = new EnhancedAbortController();
   * 
   * const linkedController = EnhancedAbortController.linkSignals(
   *   controller1.signal,
   *   controller2.signal
   * );
   * 
   * // Aborting either controller1 or controller2 will abort linkedController
   * controller1.abort();
   * console.log(linkedController.isAborted); // true
   * ```
   */
  static linkSignals(
    ...signals: EnhancedAbortSignal[]
  ): EnhancedAbortController {
    const controller = new EnhancedAbortController();
    for (const signal of signals) {
      signal.register(() => controller.abort());
    }
    return controller;
  }

  /**
   * Creates a controller that is linked to multiple signals (alternative name).
   * The linked controller will abort when any of the provided signals abort.
   * 
   * @param signals - The signals to link
   * @returns A new controller that aborts when any of the signals abort
   * 
   * @example
   * ```typescript
   * const controller1 = new EnhancedAbortController();
   * const controller2 = new EnhancedAbortController();
   * 
   * const linkedController = EnhancedAbortController.createLinkedController(
   *   controller1.signal,
   *   controller2.signal
   * );
   * ```
   */
  static createLinkedController(
    ...signals: EnhancedAbortSignal[]
  ): EnhancedAbortController {
    return this.linkSignals(...signals);
  }

  /**
   * Creates a controller that aborts after a timeout.
   * 
   * @param ms - Milliseconds to wait before aborting
   * @returns A new controller that aborts after the specified time
   * 
   * @example
   * ```typescript
   * const controller = EnhancedAbortController.timeout(5000);
   * // Controller will automatically abort after 5 seconds
   * ```
   */
  static timeout(ms: number): EnhancedAbortController {
    const controller = new EnhancedAbortController();
    controller.abortAfter(ms);
    return controller;
  }
}
