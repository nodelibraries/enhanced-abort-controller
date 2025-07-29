import { AbortError } from '../AbortError';

describe('AbortError', () => {
  test('should create AbortError with default message', () => {
    const error = new AbortError();
    expect(error).toBeInstanceOf(AbortError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AbortError');
    expect(error.message).toBe('The operation was aborted.');
  });

  test('should create AbortError with custom message', () => {
    const customMessage = 'Custom abort message';
    const error = new AbortError(customMessage);
    expect(error).toBeInstanceOf(AbortError);
    expect(error.name).toBe('AbortError');
    expect(error.message).toBe(customMessage);
  });

  test('should create AbortError with empty message', () => {
    const error = new AbortError('');
    expect(error).toBeInstanceOf(AbortError);
    expect(error.name).toBe('AbortError');
    expect(error.message).toBe('');
  });

  test('should create AbortError with undefined message', () => {
    const error = new AbortError(undefined);
    expect(error).toBeInstanceOf(AbortError);
    expect(error.name).toBe('AbortError');
    expect(error.message).toBe('The operation was aborted.');
  });

  test('should create AbortError with null message', () => {
    const error = new AbortError(null as unknown as string);
    expect(error).toBeInstanceOf(AbortError);
    expect(error.name).toBe('AbortError');
    expect(error.message).toBe('null');
  });

  test('should have correct prototype chain', () => {
    const error = new AbortError();
    expect(error).toBeInstanceOf(AbortError);
    expect(error).toBeInstanceOf(Error);
    expect(Object.getPrototypeOf(error)).toBe(AbortError.prototype);
    expect(Object.getPrototypeOf(AbortError.prototype)).toBe(Error.prototype);
  });

  test('should be throwable', () => {
    expect(() => {
      throw new AbortError('Test error');
    }).toThrow(AbortError);
  });

  test('should preserve stack trace', () => {
    const error = new AbortError('Test error');
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});
