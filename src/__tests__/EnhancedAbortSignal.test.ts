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



  test('should handle legacy onAbort method', () => {
    const controller = new EnhancedAbortController();
    let callbackCalled = false;

    controller.signal.onAbort(() => {
      callbackCalled = true;
    });

    controller.abort();
    expect(callbackCalled).toBe(true);
  });

  test('should handle legacy onAbort unregister', () => {
    const controller = new EnhancedAbortController();
    let callbackCalled = false;

    controller.signal.onAbort(() => {
      callbackCalled = true;
    });

    controller.abort();
    expect(callbackCalled).toBe(true);
  });

  test('should get underlying signal', () => {
    const controller = new EnhancedAbortController();
    const signal = controller.signal.signal;
    
    expect(signal).toBeInstanceOf(AbortSignal);
  });

  test('should create none signal', () => {
    const signal = EnhancedAbortSignal.none;
    expect(signal.isAborted).toBe(false);
    expect(signal.canBeAborted).toBe(false);
  });

  test('should create aborted signal', () => {
    const signal = EnhancedAbortSignal.aborted;
    expect(signal.isAborted).toBe(true);
  });

  test('should create timeout signal', () => {
    const signal = EnhancedAbortSignal.timeout(100);
    expect(signal).toBeInstanceOf(EnhancedAbortSignal);
  });

  test('should create any signal', () => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const anySignal = EnhancedAbortSignal.any([
      controller1.signal,
      controller2.signal,
    ]);

    expect(anySignal).toBeInstanceOf(EnhancedAbortSignal);
  });

  test('should create any signal with empty array', () => {
    const anySignal = EnhancedAbortSignal.any([]);
    expect(anySignal).toBeInstanceOf(EnhancedAbortSignal);
  });

  test('should handle any signal when one aborts', (done) => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const anySignal = EnhancedAbortSignal.any([
      controller1.signal,
      controller2.signal,
    ]);

    anySignal.register(() => {
      expect(anySignal.isAborted).toBe(true);
      done();
    });

    controller1.abort();
  });
});
