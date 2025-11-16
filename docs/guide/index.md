# Introduction

`@nodelibraries/enhanced-abort-controller` is an enhanced version of the native `AbortController` with additional features for modern Node.js and TypeScript applications. It provides timeout-based cancellation, linked controllers, and proper resource cleanup patterns.

> **@nodelibraries/enhanced-abort-controller** - Enhanced AbortController with Node.js-style patterns. Learn more in our [Installation](/guide/installation) page.

## Key Features

- 🎯 **Type-safe** - Full TypeScript support with type inference
- ⏱️ **Timeout Support** - Automatic timeout-based cancellation with TimeSpan support
- 🔗 **Linked Controllers** - Create controllers that abort when any linked signal aborts
- 📦 **Lightweight** - Zero dependencies - pure TypeScript implementation
- 🔄 **Promise Support** - Promise-based waiting with whenAborted for async workflows
- 🧹 **Resource Cleanup** - Automatic resource cleanup with registration callbacks
- ⚡ **Disposal Pattern** - Proper disposal pattern for resource management
- 🛡️ **Error Handling** - Custom AbortError with proper error inheritance

## What is AbortController?

`AbortController` is a Web API that provides a way to cancel ongoing operations. It's commonly used with `fetch` to cancel HTTP requests, but can be used with any async operation.

### Native AbortController

```typescript
const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then((response) => response.json())
  .catch((err) => {
    if (err.name === 'AbortError') {
      console.log('Request was cancelled');
    }
  });

// Cancel the request
controller.abort();
```

### Enhanced AbortController

Our enhanced version adds powerful features while maintaining full compatibility with the native API:

```typescript
import { EnhancedAbortController } from '@nodelibraries/enhanced-abort-controller';

const controller = new EnhancedAbortController();

// Auto-abort after 5 seconds
controller.abortAfter(5000);

// Register cleanup callback
controller.signal.register(() => {
  console.log('Operation was aborted, cleaning up...');
});

fetch('https://api.example.com/data', {
  signal: controller.signal.signal,
});
```

## Why Use Enhanced AbortController?

The enhanced version provides:

1. **Timeout Support** - Automatically abort after a specified time
2. **Linked Controllers** - Combine multiple abort signals
3. **TimeSpan** - Precise time interval management
4. **Resource Cleanup** - Automatic cleanup callbacks
5. **Promise Support** - `whenAborted` promise for async workflows
6. **Better Error Handling** - Custom AbortError with reasons

## Comparison with Native AbortController

| Feature           | Native  | Enhanced |
| ----------------- | ------- | -------- |
| Basic abort       | ✅      | ✅       |
| Timeout support   | ❌      | ✅       |
| Linked signals    | ❌      | ✅       |
| TimeSpan          | ❌      | ✅       |
| Cleanup callbacks | ❌      | ✅       |
| Promise support   | ❌      | ✅       |
| TypeScript        | Partial | Full     |

## Next Steps

- [Installation](/guide/installation)
- [Quick Start](/guide/quick-start)
- [EnhancedAbortController](/guide/controller)
