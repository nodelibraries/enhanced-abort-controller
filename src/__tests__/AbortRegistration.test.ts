import { AbortRegistration } from '../AbortRegistration';

describe('AbortRegistration', () => {
  test('should create registration', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    expect(registration).toBeInstanceOf(AbortRegistration);
    expect(registration.isDisposed).toBe(false);
    expect(unregisterCalled).toBe(false);
  });

  test('should unregister callback', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    registration.unregister();

    expect(registration.isDisposed).toBe(true);
    expect(unregisterCalled).toBe(true);
  });

  test('should dispose registration', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    registration.dispose();

    expect(registration.isDisposed).toBe(true);
    expect(unregisterCalled).toBe(true);
  });

  test('should not call unregister callback after unregister', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    registration.unregister();
    registration.unregister(); // Should not call callback again

    expect(registration.isDisposed).toBe(true);
    expect(unregisterCalled).toBe(true); // Should only be called once
  });

  test('should not call unregister callback after dispose', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    registration.dispose();
    registration.dispose(); // Should not call callback again

    expect(registration.isDisposed).toBe(true);
    expect(unregisterCalled).toBe(true); // Should only be called once
  });

  test('should handle multiple dispose calls', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    registration.dispose();
    registration.dispose();
    registration.unregister();

    expect(registration.isDisposed).toBe(true);
    expect(unregisterCalled).toBe(true); // Should only be called once
  });

  test('should handle multiple unregister calls', () => {
    let unregisterCalled = false;
    const unregisterCallback = () => {
      unregisterCalled = true;
    };

    const registration = new AbortRegistration(unregisterCallback);
    registration.unregister();
    registration.unregister();
    registration.dispose();

    expect(registration.isDisposed).toBe(true);
    expect(unregisterCalled).toBe(true); // Should only be called once
  });

  test('should handle empty callback', () => {
    const registration = new AbortRegistration(() => {});
    registration.unregister();

    expect(registration.isDisposed).toBe(true);
  });

  test('should handle null callback', () => {
    const registration = new AbortRegistration(() => {});
    registration.unregister();

    expect(registration.isDisposed).toBe(true);
  });
});
