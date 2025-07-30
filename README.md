# Enhanced Abort Controller

[![npm version](https://badge.fury.io/js/enhanced-abort-controller.svg)](https://badge.fury.io/js/enhanced-abort-controller)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)

> Enhanced AbortController with Node.js-style patterns for modern TypeScript applications.

## 🚀 Features

This library provides an enhanced version of the native `AbortController` with additional features for modern Node.js applications:

### ✨ **EnhancedAbortController**

- **`abort(reason?: string)`** - Immediately abort the operation with optional reason
- **`abortAfter(ms: number)`** - Abort after a specified delay in milliseconds
- **`abortAfterTimeSpan(timeSpan: TimeSpan)`** - Abort using TimeSpan objects
- **`dispose()`** - Dispose resources and abort

- **`reason`** - Get the abort reason
- **Static methods** for creating timeout controllers and linked controllers

### ✨ **EnhancedAbortSignal**

- **`register(callback)`** - Register a callback with AbortRegistration
- **`throwIfAborted(message?: string)`** - Throw AbortError if aborted

- **`whenAborted`** - Promise that resolves when signal is aborted
- **`canBeAborted`** - Check if signal can be aborted
- **Static properties** for common signal patterns
- **Static methods** for timeout and signal combination

### ✨ **TimeSpan**

- **Time interval representation** for precise time management
- **Multiple unit constructors** (milliseconds, seconds, minutes, hours, days)
- **Total value properties** for different time units
- **Static properties** (zero, maxValue, minValue)

### ✨ **AbortRegistration**

- **`unregister()`** - Unregister the callback
- **`dispose()`** - Dispose the registration
- **`isDisposed`** - Check if registration is disposed

### ✨ **Error Handling**

- **`AbortError`** - Error thrown when operation is aborted
- **Custom error messages** support
- **Proper error inheritance** from native Error class

## 📦 Installation

```bash
npm install enhanced-abort-controller
```

### TypeScript Support

This library is written in TypeScript and includes full type definitions. No additional `@types` package is required.

## 🎯 Quick Start

### Basic Usage

```typescript
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
} from 'enhanced-abort-controller';

// Create a controller
const controller = new EnhancedAbortController();

// Register a callback
const registration = controller.signal.register(() => {
  console.log('⚠️ Operation was aborted!');
});

// Abort after 5 seconds
controller.abortAfter(5000);

// Use in async operations
async function doWork(signal: EnhancedAbortSignal) {
  for (let i = 0; i < 10; i++) {
    signal.throwIfAborted();
    console.log(`Working... ${i}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

doWork(controller.signal).catch((err) => {
  if (err instanceof AbortError) {
    console.log('Operation was aborted');
  }
});

// Clean up
registration.unregister();
```

### Timeout-based Abortion

```typescript
import { EnhancedAbortController, TimeSpan } from 'enhanced-abort-controller';

const controller = new EnhancedAbortController();

// Abort after 3 seconds using milliseconds
controller.abortAfter(3000);

// Or using TimeSpan
const timeSpan = TimeSpan.fromSeconds(3);
controller.abortAfterTimeSpan(timeSpan);

// Static timeout controller
const timeoutController = EnhancedAbortController.timeout(5000);
```

### Linked Controllers

```typescript
import { EnhancedAbortController } from 'enhanced-abort-controller';

const controller1 = new EnhancedAbortController();
const controller2 = new EnhancedAbortController();
const controller3 = new EnhancedAbortController();

// Create a controller that aborts when any of the signals abort
const linkedController = EnhancedAbortController.linkSignals(
  controller1.signal,
  controller2.signal,
  controller3.signal
);

linkedController.signal.register(() => {
  console.log('🔗 Any of the linked signals was aborted!');
});

// Abort one of them
controller1.abort('User cancelled');
```

## 📚 API Reference

### EnhancedAbortController

The main controller class that manages abort operations.

#### Constructor

```typescript
new EnhancedAbortController();
```

#### Instance Methods

##### `abort(reason?: string)`

Immediately aborts the controller with an optional reason.

```typescript
const controller = new EnhancedAbortController();
controller.abort('User cancelled the operation');
```

##### `abortAfter(ms: number)`

Aborts the controller after the specified number of milliseconds.

```typescript
const controller = new EnhancedAbortController();
controller.abortAfter(5000); // Abort after 5 seconds
```

##### `abortAfterTimeSpan(timeSpan: TimeSpan)`

Aborts the controller using a TimeSpan object.

```typescript
import { TimeSpan } from 'enhanced-abort-controller';

const controller = new EnhancedAbortController();
const timeSpan = TimeSpan.fromMinutes(2.5);
controller.abortAfterTimeSpan(timeSpan);
```

##### `dispose()`

Disposes the controller and aborts it. After disposal, the controller cannot be reset.

```typescript
const controller = new EnhancedAbortController();
controller.dispose();
```

#### Instance Properties

##### `signal: EnhancedAbortSignal`

The abort signal associated with this controller.

```typescript
const controller = new EnhancedAbortController();
const signal = controller.signal;
```

##### `isAborted: boolean`

Whether the controller is currently aborted.

```typescript
const controller = new EnhancedAbortController();
console.log(controller.isAborted); // false
controller.abort();
console.log(controller.isAborted); // true
```

##### `isDisposed: boolean`

Whether the controller has been disposed.

```typescript
const controller = new EnhancedAbortController();
console.log(controller.isDisposed); // false
controller.dispose();
console.log(controller.isDisposed); // true
```

##### `reason: string | undefined`

The reason for the abort, if any.

```typescript
const controller = new EnhancedAbortController();
controller.abort('User cancelled');
console.log(controller.reason); // "User cancelled"
```

#### Static Methods

##### `linkSignals(...signals: EnhancedAbortSignal[]): EnhancedAbortController`

Creates a controller that aborts when any of the provided signals abort.

```typescript
const controller1 = new EnhancedAbortController();
const controller2 = new EnhancedAbortController();

const linkedController = EnhancedAbortController.linkSignals(
  controller1.signal,
  controller2.signal
);
```

##### `createLinkedController(...signals: EnhancedAbortSignal[]): EnhancedAbortController`

Alias for `linkSignals`.

##### `timeout(ms: number): EnhancedAbortController`

Creates a controller that automatically aborts after the specified time.

```typescript
const timeoutController = EnhancedAbortController.timeout(3000);
```

### EnhancedAbortSignal

Enhanced abort signal with additional functionality.

#### Instance Methods

##### `register(callback: () => void): AbortRegistration`

Registers a callback to be called when the signal is aborted.

```typescript
const controller = new EnhancedAbortController();
const registration = controller.signal.register(() => {
  console.log('Signal was aborted!');
});

// Later, unregister
registration.unregister();
```

##### `throwIfAborted(message?: string): void`

Throws an AbortError if the signal is aborted.

```typescript
const controller = new EnhancedAbortController();

try {
  controller.signal.throwIfAborted('Custom message');
  // Continue with work...
} catch (error) {
  if (error instanceof AbortError) {
    console.log('Operation was aborted:', error.message);
  }
}
```

#### Instance Properties

##### `isAborted: boolean`

Whether the signal is currently aborted.

```typescript
const controller = new EnhancedAbortController();
console.log(controller.signal.isAborted); // false
controller.abort();
console.log(controller.signal.isAborted); // true
```

##### `reason: string | undefined`

The reason for the abort, if any.

```typescript
const controller = new EnhancedAbortController();
controller.abort('User cancelled');
console.log(controller.signal.reason); // "User cancelled"
```

##### `canBeAborted: boolean`

Whether the signal can be aborted.

```typescript
const noneSignal = EnhancedAbortSignal.none;
console.log(noneSignal.canBeAborted); // false
```

##### `whenAborted: Promise<void>`

A promise that resolves when the signal is aborted.

```typescript
const controller = new EnhancedAbortController();

controller.signal.whenAborted.then(() => {
  console.log('Signal was aborted!');
});

// Later
controller.abort();
```

##### `signal: AbortSignal`

The underlying native AbortSignal.

```typescript
const controller = new EnhancedAbortController();
const nativeSignal = controller.signal;
```

#### Static Properties

##### `none: EnhancedAbortSignal`

A signal that never aborts.

```typescript
const neverAborting = EnhancedAbortSignal.none;
console.log(neverAborting.isAborted); // false
console.log(neverAborting.canBeAborted); // false
```

##### `aborted: EnhancedAbortSignal`

A signal that is already aborted.

```typescript
const alreadyAborted = EnhancedAbortSignal.aborted;
console.log(alreadyAborted.isAborted); // true
```

#### Static Methods

##### `timeout(ms: number): EnhancedAbortSignal`

Creates a signal that automatically aborts after the specified time.

```typescript
const timeoutSignal = EnhancedAbortSignal.timeout(2000);
```

##### `any(signals: EnhancedAbortSignal[]): EnhancedAbortSignal`

Creates a signal that aborts when any of the provided signals abort.

```typescript
const signal1 = new EnhancedAbortController();
const signal2 = new EnhancedAbortController();

const anySignal = EnhancedAbortSignal.any([signal1.signal, signal2.signal]);
```

### TimeSpan

A class for representing time intervals, inspired by .NET Core's TimeSpan.

#### Constructor

```typescript
new TimeSpan(milliseconds: number)
```

#### Instance Properties

##### `milliseconds: number`

The total milliseconds of the time span.

```typescript
const timeSpan = TimeSpan.fromSeconds(30);
console.log(timeSpan.milliseconds); // 30000
```

##### `totalSeconds: number`

The total seconds of the time span.

```typescript
const timeSpan = TimeSpan.fromMinutes(2.5);
console.log(timeSpan.totalSeconds); // 150
```

##### `totalMinutes: number`

The total minutes of the time span.

```typescript
const timeSpan = TimeSpan.fromHours(1.5);
console.log(timeSpan.totalMinutes); // 90
```

##### `totalHours: number`

The total hours of the time span.

```typescript
const timeSpan = TimeSpan.fromDays(1.5);
console.log(timeSpan.totalHours); // 36
```

##### `totalDays: number`

The total days of the time span.

```typescript
const timeSpan = TimeSpan.fromHours(48);
console.log(timeSpan.totalDays); // 2
```

#### Static Methods

##### `fromMilliseconds(ms: number): TimeSpan`

Creates a TimeSpan from milliseconds.

```typescript
const timeSpan = TimeSpan.fromMilliseconds(1500);
```

##### `fromSeconds(seconds: number): TimeSpan`

Creates a TimeSpan from seconds.

```typescript
const timeSpan = TimeSpan.fromSeconds(30);
```

##### `fromMinutes(minutes: number): TimeSpan`

Creates a TimeSpan from minutes.

```typescript
const timeSpan = TimeSpan.fromMinutes(2.5);
```

##### `fromHours(hours: number): TimeSpan`

Creates a TimeSpan from hours.

```typescript
const timeSpan = TimeSpan.fromHours(1.5);
```

##### `fromDays(days: number): TimeSpan`

Creates a TimeSpan from days.

```typescript
const timeSpan = TimeSpan.fromDays(1.5);
```

#### Static Properties

##### `zero: TimeSpan`

A TimeSpan representing zero time.

```typescript
console.log(TimeSpan.zero.milliseconds); // 0
```

##### `maxValue: TimeSpan`

A TimeSpan representing the maximum possible time.

```typescript
console.log(TimeSpan.maxValue.milliseconds); // 9007199254740991
```

##### `minValue: TimeSpan`

A TimeSpan representing the minimum possible time.

```typescript
console.log(TimeSpan.minValue.milliseconds); // -9007199254740991
```

### AbortRegistration

Represents a registration for an abort signal callback.

#### Instance Methods

##### `unregister(): void`

Unregisters the callback from the signal.

```typescript
const controller = new EnhancedAbortController();
const registration = controller.signal.register(() => {
  console.log('Aborted!');
});

registration.unregister();
```

##### `dispose(): void`

Disposes the registration (same as unregister).

```typescript
const registration = controller.signal.register(() => {
  console.log('Aborted!');
});

registration.dispose();
```

#### Instance Properties

##### `isDisposed: boolean`

Whether the registration has been disposed.

```typescript
const registration = controller.signal.register(() => {});
console.log(registration.isDisposed); // false
registration.unregister();
console.log(registration.isDisposed); // true
```

### AbortError

Error thrown when an operation is aborted.

#### Constructor

```typescript
new AbortError(message?: string)
```

#### Usage

```typescript
import { AbortError } from 'enhanced-abort-controller';

try {
  signal.throwIfAborted('Custom message');
} catch (error) {
  if (error instanceof AbortError) {
    console.log('Operation was aborted:', error.message);
  }
}
```

## 🔧 Advanced Usage Examples

### Complex Async Workflow

```typescript
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
} from 'enhanced-abort-controller';

async function complexWorkflow(signal: EnhancedAbortSignal) {
  console.log('🔄 Starting complex workflow...');

  try {
    // Step 1: Data preparation
    signal.throwIfAborted();
    console.log('📊 Step 1: Preparing data...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 2: Data processing
    signal.throwIfAborted();
    console.log('⚙️ Step 2: Processing data...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 3: Data validation
    signal.throwIfAborted();
    console.log('✅ Step 3: Validating data...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('✅ Complex workflow completed successfully!');
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('⛔️ Complex workflow aborted:', error.message);
    } else {
      console.log('❌ Complex workflow failed:', error);
    }
  }
}

const controller = new EnhancedAbortController();
complexWorkflow(controller.signal);

// Abort after 1 second
setTimeout(() => {
  controller.abort('User cancelled workflow');
}, 1000);
```

## 🌐 Library Integration Examples

### Fetch API Integration

```typescript
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
} from 'enhanced-abort-controller';

async function fetchWithAbort(url: string, signal: EnhancedAbortSignal) {
  try {
    const response = await fetch(url, {
      signal: signal.signal, // Use native AbortSignal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('Fetch was aborted:', error.message);
    }
    throw error;
  }
}

const controller = new EnhancedAbortController();
controller.abortAfter(5000); // Abort after 5 seconds

fetchWithAbort('https://api.example.com/data', controller.signal).catch(() =>
  console.log('Fetch completed')
);
```

### Axios Integration

```typescript
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
} from 'enhanced-abort-controller';
import axios from 'axios';

async function axiosWithAbort(url: string, signal: EnhancedAbortSignal) {
  try {
    const response = await axios.get(url, {
      signal: signal.signal,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('Axios request was aborted:', error.message);
    }
    throw error;
  }
}

const controller = new EnhancedAbortController();
controller.abortAfter(3000);

axiosWithAbort('https://api.example.com/data', controller.signal).catch(() =>
  console.log('Axios request completed')
);
```

### Resource Cleanup Pattern

```typescript
import { EnhancedAbortController } from 'enhanced-abort-controller';

const controller = new EnhancedAbortController();

// Simulate resource allocation
let resources = ['Resource 1', 'Resource 2', 'Resource 3'];
console.log('📦 Allocated resources:', resources);

const cleanupRegistration = controller.signal.register(() => {
  // Cleanup resources
  resources = [];
  console.log('🧹 Resources cleaned up due to abort');
});

// Simulate work
setTimeout(() => {
  console.log('✅ Work completed, cleaning up normally...');
  cleanupRegistration.unregister();
  resources = [];
  console.log('🧹 Resources cleaned up normally');
}, 1500);

// Abort after 1 second (before normal completion)
setTimeout(() => {
  controller.abort('Resource cleanup test');
}, 1000);
```

### Multiple Controllers with Different Strategies

```typescript
import { EnhancedAbortController, TimeSpan } from 'enhanced-abort-controller';

// Controller with immediate abort
const immediateController = new EnhancedAbortController();
immediateController.signal.register(() => {
  console.log('⚡ Immediate controller aborted');
});

// Controller with timeout
const timeoutController = EnhancedAbortController.timeout(3000);
timeoutController.signal.register(() => {
  console.log('⏰ Timeout controller aborted');
});

// Controller with TimeSpan
const timeSpanController = new EnhancedAbortController();
timeSpanController.abortAfterTimeSpan(TimeSpan.fromSeconds(2.5));
timeSpanController.signal.register(() => {
  console.log('📅 TimeSpan controller aborted');
});

// Abort immediate controller after 1 second
setTimeout(() => {
  immediateController.abort('Immediate abort');
}, 1000);
```

### Error Handling Patterns

```typescript
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
} from 'enhanced-abort-controller';

const controller = new EnhancedAbortController();

// Pattern 1: Try-catch with throwIfAborted
async function pattern1(signal: EnhancedAbortSignal) {
  try {
    signal.throwIfAborted();
    console.log('✅ Pattern 1: Operation completed');
  } catch (error) {
    if (error instanceof AbortError) {
      console.log('⛔️ Pattern 1: Operation aborted');
    }
  }
}

// Pattern 2: Check isAborted before operations
async function pattern2(signal: EnhancedAbortSignal) {
  if (signal.isAborted) {
    console.log('⛔️ Pattern 2: Signal already aborted');
    return;
  }
  console.log('✅ Pattern 2: Operation completed');
}

// Pattern 3: Use whenAborted promise
async function pattern3(signal: EnhancedAbortSignal) {
  await signal.whenAborted;
  console.log('⛔️ Pattern 3: Signal was aborted');
}

// Test patterns
pattern1(controller.signal);
pattern2(controller.signal);
pattern3(controller.signal);

// Abort after delay
setTimeout(() => {
  controller.abort('Error pattern test');
}, 800);
```

## 🧪 Testing

The library includes comprehensive test coverage. Run the tests with:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📝 Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Development Mode

```bash
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of the native Web API `AbortController`
- Designed for modern TypeScript and Node.js applications
- Node.js-style patterns for clean and efficient async operations

## 🔗 Links

- [GitHub Repository](https://github.com/ylcnfrht/enhanced-abort-controller)
- [npm Package](https://www.npmjs.com/package/enhanced-abort-controller)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)

---

**Made with ❤️ for the TypeScript and Node.js community**
