import { EnhancedAbortController, TimeSpan } from '../index';

describe('EnhancedAbortController', () => {
  test('should create controller with non-aborted signal', () => {
    const controller = new EnhancedAbortController();
    expect(controller.isAborted).toBe(false);
    expect(controller.signal.aborted).toBe(false);
  });

  test('should abort controller', () => {
    const controller = new EnhancedAbortController();
    controller.abort();
    expect(controller.isAborted).toBe(true);
    expect(controller.signal.aborted).toBe(true);
  });

  test('should abort with reason', () => {
    const controller = new EnhancedAbortController();
    const reason = 'Test reason';
    controller.abort(reason);
    expect(controller.reason).toBe(reason);
    expect(controller.signal.reason).toBe(reason);
  });

  test('should abort after delay', (done) => {
    const controller = new EnhancedAbortController();
    controller.abortAfter(100);

    setTimeout(() => {
      expect(controller.isAborted).toBe(true);
      done();
    }, 150);
  });

  test('should abort after TimeSpan', (done) => {
    const controller = new EnhancedAbortController();
    const timeSpan = TimeSpan.fromMilliseconds(100);
    controller.abortAfterTimeSpan(timeSpan);

    setTimeout(() => {
      expect(controller.isAborted).toBe(true);
      done();
    }, 150);
  });

  test('should not abort if already disposed', () => {
    const controller = new EnhancedAbortController();
    controller.dispose();
    controller.abort();
    expect(controller.isAborted).toBe(false);
  });

  test('should not abort after delay if already disposed', (done) => {
    const controller = new EnhancedAbortController();
    controller.dispose();
    controller.abortAfter(100);

    setTimeout(() => {
      expect(controller.isAborted).toBe(false);
      done();
    }, 150);
  });

  test('should not abort after TimeSpan if already disposed', (done) => {
    const controller = new EnhancedAbortController();
    controller.dispose();
    const timeSpan = TimeSpan.fromMilliseconds(100);
    controller.abortAfterTimeSpan(timeSpan);

    setTimeout(() => {
      expect(controller.isAborted).toBe(false);
      done();
    }, 150);
  });

  test('should clear timeout when aborting', (done) => {
    const controller = new EnhancedAbortController();
    controller.abortAfter(1000);
    controller.abort();

    setTimeout(() => {
      expect(controller.isAborted).toBe(true);
      done();
    }, 100);
  });

  test('should clear timeout when aborting with reason', (done) => {
    const controller = new EnhancedAbortController();
    controller.abortAfter(1000);
    controller.abort('Manual abort');

    setTimeout(() => {
      expect(controller.isAborted).toBe(true);
      expect(controller.reason).toBe('Manual abort');
      done();
    }, 100);
  });

  test('should dispose controller', () => {
    const controller = new EnhancedAbortController();
    controller.dispose();
    expect(controller.isDisposed).toBe(true);
  });

  test('should not dispose twice', () => {
    const controller = new EnhancedAbortController();
    controller.dispose();
    controller.dispose(); // Should not throw
    expect(controller.isDisposed).toBe(true);
  });

  test('should create linked controller', () => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const linkedController = EnhancedAbortController.linkSignals(
      controller1.signal,
      controller2.signal
    );

    expect(linkedController).toBeInstanceOf(EnhancedAbortController);
  });

  test('should create linked controller with createLinkedController', () => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const linkedController = EnhancedAbortController.createLinkedController(
      controller1.signal,
      controller2.signal
    );

    expect(linkedController).toBeInstanceOf(EnhancedAbortController);
  });

  test('should create linked controller with empty signals', () => {
    const linkedController = EnhancedAbortController.linkSignals();
    expect(linkedController).toBeInstanceOf(EnhancedAbortController);
  });

  test('should create timeout controller', () => {
    const controller = EnhancedAbortController.timeout(100);
    expect(controller).toBeInstanceOf(EnhancedAbortController);
  });

  test('should handle linked controller when one aborts', (done) => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const linkedController = EnhancedAbortController.linkSignals(
      controller1.signal,
      controller2.signal
    );

    linkedController.signal.register(() => {
      expect(linkedController.isAborted).toBe(true);
      done();
    });

    controller1.abort();
  });

  test('should handle linked controller when multiple abort', (done) => {
    const controller1 = new EnhancedAbortController();
    const controller2 = new EnhancedAbortController();

    const linkedController = EnhancedAbortController.linkSignals(
      controller1.signal,
      controller2.signal
    );

    let abortCount = 0;
    linkedController.signal.register(() => {
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
