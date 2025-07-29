import { TimeSpan } from '../TimeSpan';

describe('TimeSpan', () => {
  test('should create from milliseconds', () => {
    const timeSpan = TimeSpan.fromMilliseconds(1500);
    expect(timeSpan.milliseconds).toBe(1500);
    expect(timeSpan.totalSeconds).toBe(1.5);
  });

  test('should create from seconds', () => {
    const timeSpan = TimeSpan.fromSeconds(2.5);
    expect(timeSpan.milliseconds).toBe(2500);
    expect(timeSpan.totalSeconds).toBe(2.5);
  });

  test('should create from minutes', () => {
    const timeSpan = TimeSpan.fromMinutes(1.5);
    expect(timeSpan.milliseconds).toBe(90000);
    expect(timeSpan.totalMinutes).toBe(1.5);
  });

  test('should create from hours', () => {
    const timeSpan = TimeSpan.fromHours(2.5);
    expect(timeSpan.milliseconds).toBe(9000000);
    expect(timeSpan.totalHours).toBe(2.5);
  });

  test('should create from days', () => {
    const timeSpan = TimeSpan.fromDays(1.5);
    expect(timeSpan.milliseconds).toBe(129600000);
    expect(timeSpan.totalDays).toBe(1.5);
  });

  test('should get zero timeSpan', () => {
    const timeSpan = TimeSpan.zero;
    expect(timeSpan.milliseconds).toBe(0);
    expect(timeSpan.totalSeconds).toBe(0);
    expect(timeSpan.totalMinutes).toBe(0);
    expect(timeSpan.totalHours).toBe(0);
    expect(timeSpan.totalDays).toBe(0);
  });

  test('should get maxValue timeSpan', () => {
    const timeSpan = TimeSpan.maxValue;
    expect(timeSpan.milliseconds).toBe(Number.MAX_SAFE_INTEGER);
  });

  test('should get minValue timeSpan', () => {
    const timeSpan = TimeSpan.minValue;
    expect(timeSpan.milliseconds).toBe(Number.MIN_SAFE_INTEGER);
  });

  test('should handle constructor with milliseconds', () => {
    const timeSpan = new TimeSpan(5000);
    expect(timeSpan.milliseconds).toBe(5000);
  });

  test('should calculate total values correctly', () => {
    const timeSpan = new TimeSpan(3661000); // 1 hour, 1 minute, 1 second
    
    expect(timeSpan.totalSeconds).toBe(3661);
    expect(timeSpan.totalMinutes).toBe(61.016666666666666);
    expect(timeSpan.totalHours).toBe(1.0169444444444444);
    expect(timeSpan.totalDays).toBe(0.04237268518518519);
  });
});
