import { AbortError } from './AbortError';
import { AbortRegistration } from './AbortRegistration';

/**
 * Enhanced AbortSignal with .NET Core CancellationToken-inspired patterns.
 * 
 * This class provides an enhanced version of the native AbortSignal with additional
 * features like registration callbacks, promise-based waiting, and static signal factories.
 * 
 * @example
 * ```typescript
 * const controller = new EnhancedAbortController();
 * const signal = controller.signal;
 * 
 * // Register a callback
 * const registration = signal.register(() => {
 *   console.log('Operation was aborted!');
 * });
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
 * doWork(signal).catch(err => {
 *   if (err instanceof AbortError) {
 *     console.log('Operation was aborted');
 *   }
 * });
 * ```
 */
export class EnhancedAbortSignal {
  private _canBeAborted: boolean = true;
  
  /**
   * Creates a new EnhancedAbortSignal instance.
   * 
   * @param abortSignal - The underlying AbortSignal
   * 
   * @example
   * ```typescript
   * const controller = new AbortController();
   * const signal = new EnhancedAbortSignal(controller.signal);
   * ```
   */
  constructor(private readonly abortSignal: AbortSignal) {}

  /**
   * Gets whether the signal has been aborted.
   * 
   * @returns True if the signal has been aborted, false otherwise
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * console.log(controller.signal.isAborted); // false
   * controller.abort();
   * console.log(controller.signal.isAborted); // true
   * ```
   */
  get isAborted(): boolean {
    return this.abortSignal.aborted;
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
   * console.log(controller.signal.reason); // 'User cancelled'
   * ```
   */
  get reason(): any {
    return this.abortSignal.reason;
  }

  /**
   * Gets whether the signal can be aborted.
   * 
   * @returns True if the signal can be aborted, false otherwise
   * 
   * @example
   * ```typescript
   * const signal = EnhancedAbortSignal.none;
   * console.log(signal.canBeAborted); // false
   * ```
   */
  get canBeAborted(): boolean {
    return this._canBeAborted !== false;
  }

  /**
   * Gets a promise that resolves when the signal is aborted.
   * Similar to WaitHandle in .NET.
   * 
   * @returns A promise that resolves when the signal is aborted
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * 
   * controller.signal.whenAborted.then(() => {
   *   console.log('Signal was aborted!');
   * });
   * 
   * setTimeout(() => controller.abort(), 5000);
   * ```
   */
  get whenAborted(): Promise<void> {
    if (this.isAborted) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const registration = this.register(() => resolve());
      // Auto-unregister when resolved
      Promise.resolve().then(() => registration.unregister());
    });
  }

  /**
   * Throws AbortError if the signal has been aborted.
   * 
   * @param customMessage - Optional custom message for the AbortError
   * @throws {AbortError} When the signal has been aborted
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
   *     console.log('Operation was aborted');
   *   }
   * }
   * ```
   */
  throwIfAborted(customMessage?: string): void {
    if (this.isAborted) {
      throw new AbortError(customMessage);
    }
  }

  /**
   * Registers a callback to be called when the signal is aborted.
   * 
   * @param callback - The callback to register
   * @returns AbortRegistration that can be used to unregister the callback
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
   * ```
   */
  register(callback: () => void): AbortRegistration {
    if (this.isAborted) {
      callback();
      return new AbortRegistration(() => {});
    }

    const listener = () => callback();
    this.signal.addEventListener('abort', listener, { once: true });

    return new AbortRegistration(() => {
      this.signal.removeEventListener('abort', listener);
    });
  }

  /**
   * Legacy method for backward compatibility.
   * @deprecated Use register() instead
   * 
   * @param callback - The callback to register
   * @returns A function that can be called to unregister the callback
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * 
   * const unregister = controller.signal.onAbort(() => {
   *   console.log('Operation was aborted!');
   * });
   * 
   * // Later, unregister the callback
   * unregister();
   * ```
   */
  onAbort(callback: () => void): () => void {
    const registration = this.register(callback);

    return () => registration.unregister();
  }

  /**
   * Gets the underlying AbortSignal.
   * 
   * @returns The underlying AbortSignal instance
   * 
   * @example
   * ```typescript
   * const controller = new EnhancedAbortController();
   * const underlyingSignal = controller.signal.signal;
   * ```
   */
  get signal(): AbortSignal {
    return this.abortSignal;
  }

  /**
   * Creates a signal that never aborts (equivalent to CancellationToken.None).
   * 
   * @returns A signal that never aborts
   * 
   * @example
   * ```typescript
   * const signal = EnhancedAbortSignal.none;
   * console.log(signal.isAborted); // false
   * console.log(signal.canBeAborted); // false
   * ```
   */
  static get none(): EnhancedAbortSignal {
    const controller = new AbortController();
    const signal = new EnhancedAbortSignal(controller.signal);
    (signal as any)._canBeAborted = false;
    return signal;
  }

  /**
   * Creates a signal that is already aborted.
   * 
   * @returns A signal that is already aborted
   * 
   * @example
   * ```typescript
   * const signal = EnhancedAbortSignal.aborted;
   * console.log(signal.isAborted); // true
   * ```
   */
  static get aborted(): EnhancedAbortSignal {
    const controller = new AbortController();
    controller.abort();
    return new EnhancedAbortSignal(controller.signal);
  }

  /**
   * Creates a signal that aborts after a timeout.
   * 
   * @param ms - Milliseconds to wait before aborting
   * @returns A signal that aborts after the specified time
   * 
   * @example
   * ```typescript
   * const signal = EnhancedAbortSignal.timeout(5000);
   * // Signal will automatically abort after 5 seconds
   * ```
   */
  static timeout(ms: number): EnhancedAbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return new EnhancedAbortSignal(controller.signal);
  }

  /**
   * Creates a signal that aborts when any of the signals abort.
   * 
   * @param signals - The signals to combine
   * @returns A signal that aborts when any of the signals abort
   * 
   * @example
   * ```typescript
   * const controller1 = new EnhancedAbortController();
   * const controller2 = new EnhancedAbortController();
   * 
   * const anySignal = EnhancedAbortSignal.any([
   *   controller1.signal,
   *   controller2.signal
   * ]);
   * 
   * // Aborting either controller1 or controller2 will abort anySignal
   * controller1.abort();
   * console.log(anySignal.isAborted); // true
   * ```
   */
  static any(signals: EnhancedAbortSignal[]): EnhancedAbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      signal.register(() => controller.abort());
    }

    return new EnhancedAbortSignal(controller.signal);
  }
}
