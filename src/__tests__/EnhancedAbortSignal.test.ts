import { AbortError } from '../AbortError';
import { EnhancedAbortController } from '../EnhancedAbortController';
import { EnhancedAbortSignal } from '../EnhancedAbortSignal';

describe('EnhancedAbortSignal', () => {
  test('should throw if aborted', () => {
    const controller = new EnhancedAbortController();
    controller.abort();

    expect(() => {
      controller.signal.throwIfAborted();
    }).toThrow(AbortError);
  });

  test('should throw if aborted with custom message', () => {
    const controller = new EnhancedAbortController();
    controller.abort();

    expect(() => {
      controller.signal.throwIfAborted('Custom abort message');
    }).toThrow(AbortError);
  });

  test('should not throw if not aborted', () => {
    const controller = new EnhancedAbortController();

    expect(() => {
      controller.signal.throwIfAborted();
    }).not.toThrow();
  });

  test('should register callback', () => {
    const controller = new EnhancedAbortController();
    let callbackCalled = false;

    controller.signal.register(() => {
      callbackCalled = true;
    });

    controller.abort();
    expect(callbackCalled).toBe(true);
  });

  test('should register callback when already aborted', () => {
    const controller = new EnhancedAbortController();
    controller.abort();
    let callbackCalled = false;

    controller.signal.register(() => {
      callbackCalled = true;
    });

    expect(callbackCalled).toBe(true);
  });

  test('should unregister callback', () => {
    const controller = new EnhancedAbortController();
    let callbackCalled = false;

    controller.signal
      .register(() => {
        callbackCalled = true;
      })
      .unregister();

    controller.abort();
    expect(callbackCalled).toBe(false);
  });

  test('should handle multiple registrations', () => {
    const controller = new EnhancedAbortController();
    let callback1Called = false;
    let callback2Called = false;

    controller.signal.register(() => {
      callback1Called = true;
    });

    controller.signal.register(() => {
      callback2Called = true;
    });

    controller.abort();
    expect(callback1Called).toBe(true);
    expect(callback2Called).toBe(true);
  });

  test('should handle whenAborted promise', async () => {
    const controller = new EnhancedAbortController();
    let resolved = false;

    const promise = controller.signal.whenAborted.then(() => {
      resolved = true;
    });

    controller.abort();
    await promise;
    expect(resolved).toBe(true);
  });

  test('should handle whenAborted promise when already aborted', async () => {
    const controller = new EnhancedAbortController();
    controller.abort();

    const promise = controller.signal.whenAborted;
    await promise;
    expect(promise).resolves.toBeUndefined();
  });

  test('should handle register method', () => {
    const controller = new EnhancedAbortController();
    let callbackCalled = false;

    controller.signal.register(() => {
      callbackCalled = true;
    });

    controller.abort();
    expect(callbackCalled).toBe(true);
  });

  test('should handle register unregister', () => {
    const controller = new EnhancedAbortController();
    let callbackCalled = false;

    const registration = controller.signal.register(() => {
      callbackCalled = true;
    });

    registration.unregister();
    controller.abort();
    expect(callbackCalled).toBe(false);
  });

  test('should get underlying signal', () => {
    const controller = new EnhancedAbortController();
    const signal = controller.signal;

    expect(signal).toBeInstanceOf(EnhancedAbortSignal);
    expect(signal.aborted).toBeDefined();
    expect(typeof signal.reason).toBe('undefined'); // reason is undefined when not aborted
  });

  test('should handle canBeAborted property', () => {
    const controller = new EnhancedAbortController();
    const signal = controller.signal;

    expect(signal.canBeAborted).toBe(true);

    // Test with none signal
    const noneSignal = EnhancedAbortSignal.none;
    expect(noneSignal.canBeAborted).toBe(false);
  });

  test('should handle isAborted property', () => {
    const controller = new EnhancedAbortController();
    const signal = controller.signal;

    expect(signal.isAborted).toBe(false);
    controller.abort();
    expect(signal.isAborted).toBe(true);
  });

  test('should handle static none signal', () => {
    const signal = EnhancedAbortSignal.none;

    expect(signal).toBeInstanceOf(EnhancedAbortSignal);
    expect(signal.isAborted).toBe(false);
    expect(signal.canBeAborted).toBe(false);
  });

  test('should handle static aborted signal', () => {
    const signal = EnhancedAbortSignal.aborted;

    expect(signal).toBeInstanceOf(EnhancedAbortSignal);
    expect(signal.isAborted).toBe(true);
  });

  test('should handle static timeout signal', (done) => {
    const signal = EnhancedAbortSignal.timeout(100);

    expect(signal).toBeInstanceOf(EnhancedAbortSignal);
    expect(signal.isAborted).toBe(false);

    signal.register(() => {
      expect(signal.isAborted).toBe(true);
      done();
    });
  });

  test('should handle static any signal', (done) => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const anySignal = EnhancedAbortSignal.any([
      controller1.signal,
      controller2.signal,
    ]);

    expect(anySignal).toBeInstanceOf(EnhancedAbortSignal);
    expect(anySignal.isAborted).toBe(false);

    anySignal.register(() => {
      expect(anySignal.isAborted).toBe(true);
      done();
    });

    controller1.abort();
  });

  test('should handle multiple signals in any', (done) => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const anySignal = EnhancedAbortSignal.any([
      controller1.signal,
      controller2.signal,
    ]);

    let abortCount = 0;
    anySignal.register(() => {
      abortCount++;
    });

    controller1.abort();
    controller2.abort();

    setTimeout(() => {
      expect(abortCount).toBe(1); // Should only trigger once
      done();
    }, 50);
  });
});
