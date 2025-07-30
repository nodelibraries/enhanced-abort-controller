/**
 * TimeSpan-like class for precise time interval management.
 *
 * This class provides a way to represent time intervals with various units
 * and conversion methods for modern Node.js applications.
 *
 * @example
 * ```typescript
 * // Create from different units
 * const timeSpan1 = TimeSpan.fromSeconds(30);
 * const timeSpan2 = TimeSpan.fromMinutes(2.5);
 * const timeSpan3 = TimeSpan.fromHours(1.5);
 *
 * // Access total values
 * console.log(timeSpan1.totalSeconds); // 30
 * console.log(timeSpan2.totalMinutes); // 2.5
 * console.log(timeSpan3.totalHours); // 1.5
 *
 * // Use with EnhancedAbortController
 * const controller = new EnhancedAbortController();
 * controller.abortAfterTimeSpan(TimeSpan.fromSeconds(5));
 * ```
 */
export class TimeSpan {
  private readonly _milliseconds: number;

  /**
   * Creates a new TimeSpan instance from milliseconds.
   *
   * @param milliseconds - The number of milliseconds
   *
   * @example
   * ```typescript
   * const timeSpan = new TimeSpan(1500);
   * console.log(timeSpan.milliseconds); // 1500
   * ```
   */
  constructor(milliseconds: number) {
    this._milliseconds = milliseconds;
  }

  /**
   * Gets the total milliseconds.
   *
   * @returns The total number of milliseconds
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromSeconds(2.5);
   * console.log(timeSpan.milliseconds); // 2500
   * ```
   */
  get milliseconds(): number {
    return this._milliseconds;
  }

  /**
   * Gets the total seconds.
   *
   * @returns The total number of seconds
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromMilliseconds(2500);
   * console.log(timeSpan.totalSeconds); // 2.5
   * ```
   */
  get totalSeconds(): number {
    return this._milliseconds / 1000;
  }

  /**
   * Gets the total minutes.
   *
   * @returns The total number of minutes
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromSeconds(90);
   * console.log(timeSpan.totalMinutes); // 1.5
   * ```
   */
  get totalMinutes(): number {
    return this._milliseconds / (1000 * 60);
  }

  /**
   * Gets the total hours.
   *
   * @returns The total number of hours
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromMinutes(90);
   * console.log(timeSpan.totalHours); // 1.5
   * ```
   */
  get totalHours(): number {
    return this._milliseconds / (1000 * 60 * 60);
  }

  /**
   * Gets the total days.
   *
   * @returns The total number of days
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromHours(48);
   * console.log(timeSpan.totalDays); // 2
   * ```
   */
  get totalDays(): number {
    return this._milliseconds / (1000 * 60 * 60 * 24);
  }

  /**
   * Creates a TimeSpan from milliseconds.
   *
   * @param milliseconds - The number of milliseconds
   * @returns A new TimeSpan instance
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromMilliseconds(1500);
   * console.log(timeSpan.totalSeconds); // 1.5
   * ```
   */
  static fromMilliseconds(milliseconds: number): TimeSpan {
    return new TimeSpan(milliseconds);
  }

  /**
   * Creates a TimeSpan from seconds.
   *
   * @param seconds - The number of seconds
   * @returns A new TimeSpan instance
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromSeconds(2.5);
   * console.log(timeSpan.milliseconds); // 2500
   * ```
   */
  static fromSeconds(seconds: number): TimeSpan {
    return new TimeSpan(seconds * 1000);
  }

  /**
   * Creates a TimeSpan from minutes.
   *
   * @param minutes - The number of minutes
   * @returns A new TimeSpan instance
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromMinutes(1.5);
   * console.log(timeSpan.milliseconds); // 90000
   * ```
   */
  static fromMinutes(minutes: number): TimeSpan {
    return new TimeSpan(minutes * 60 * 1000);
  }

  /**
   * Creates a TimeSpan from hours.
   *
   * @param hours - The number of hours
   * @returns A new TimeSpan instance
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromHours(2.5);
   * console.log(timeSpan.milliseconds); // 9000000
   * ```
   */
  static fromHours(hours: number): TimeSpan {
    return new TimeSpan(hours * 60 * 60 * 1000);
  }

  /**
   * Creates a TimeSpan from days.
   *
   * @param days - The number of days
   * @returns A new TimeSpan instance
   *
   * @example
   * ```typescript
   * const timeSpan = TimeSpan.fromDays(1.5);
   * console.log(timeSpan.milliseconds); // 129600000
   * ```
   */
  static fromDays(days: number): TimeSpan {
    return new TimeSpan(days * 24 * 60 * 60 * 1000);
  }

  /**
   * Gets a TimeSpan representing zero time.
   *
   * @returns A TimeSpan representing zero time
   *
   * @example
   * ```typescript
   * const zero = TimeSpan.zero;
   * console.log(zero.milliseconds); // 0
   * console.log(zero.totalSeconds); // 0
   * ```
   */
  static get zero(): TimeSpan {
    return new TimeSpan(0);
  }

  /**
   * Gets a TimeSpan representing the maximum safe integer value.
   *
   * @returns A TimeSpan representing the maximum value
   *
   * @example
   * ```typescript
   * const max = TimeSpan.maxValue;
   * console.log(max.milliseconds); // Number.MAX_SAFE_INTEGER
   * ```
   */
  static get maxValue(): TimeSpan {
    return new TimeSpan(Number.MAX_SAFE_INTEGER);
  }

  /**
   * Gets a TimeSpan representing the minimum safe integer value.
   *
   * @returns A TimeSpan representing the minimum value
   *
   * @example
   * ```typescript
   * const min = TimeSpan.minValue;
   * console.log(min.milliseconds); // Number.MIN_SAFE_INTEGER
   * ```
   */
  static get minValue(): TimeSpan {
    return new TimeSpan(Number.MIN_SAFE_INTEGER);
  }
}
