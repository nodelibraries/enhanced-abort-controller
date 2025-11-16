# Quick Start

This guide will walk you through creating your first Enhanced AbortController setup.

## Basic Example

```typescript
import { EnhancedAbortController } from '@nodelibraries/enhanced-abort-controller';

// 1. Create a controller
const controller = new EnhancedAbortController();

// 2. Register a callback for abort events
controller.signal.register(() => {
  console.log('⚠️ Operation was aborted!');
});

// 3. Abort after 5 seconds
controller.abortAfter(5000);

// 4. Use with fetch
fetch('https://api.example.com/data', {
  signal: controller.signal.signal,
}).catch((err) => {
  if (err.name === 'AbortError') {
    console.log('Request was cancelled');
  }
});
```

## Step-by-Step Explanation

### 1. Create a Controller

Create a new `EnhancedAbortController` instance:

```typescript
const controller = new EnhancedAbortController();
```

### 2. Register Abort Callback

Register a callback to be called when the operation is aborted:

```typescript
controller.signal.register(() => {
  console.log('Operation was aborted!');
});
```

### 3. Set Timeout

Automatically abort after a specified time:

```typescript
controller.abortAfter(5000); // Abort after 5 seconds
```

### 4. Use with Fetch

Use the signal with fetch or any API that supports AbortSignal:

```typescript
fetch('https://api.example.com/data', {
  signal: controller.signal.signal,
});
```

## With TimeSpan

Use `TimeSpan` for more readable time intervals:

```typescript
import {
  EnhancedAbortController,
  TimeSpan,
} from '@nodelibraries/enhanced-abort-controller';

const controller = new EnhancedAbortController();
const timeSpan = TimeSpan.fromSeconds(5);
controller.abortAfterTimeSpan(timeSpan);
```

## Linked Controllers

Create a controller that aborts when any linked signal aborts:

```typescript
const userController = new EnhancedAbortController();
const timeoutController = EnhancedAbortController.timeout(10000);

// Abort if user cancels OR timeout occurs
const linked = EnhancedAbortController.linkSignals(
  userController.signal,
  timeoutController.signal
);

fetch('https://api.example.com/data', {
  signal: linked.signal.signal,
});
```

## Async Workflow

Use in async workflows with proper error handling:

```typescript
import {
  EnhancedAbortController,
  AbortError,
  EnhancedAbortSignal,
} from '@nodelibraries/enhanced-abort-controller';

async function processData(signal: EnhancedAbortSignal) {
  for (let i = 0; i < 100; i++) {
    signal.throwIfAborted(); // Check if aborted
    await processItem(i);
  }
}

const controller = new EnhancedAbortController();
controller.abortAfter(5000);

processData(controller.signal).catch((err) => {
  if (err instanceof AbortError) {
    console.log('Processing was cancelled');
  }
});
```

## Next Steps

- Check out [Examples](/examples/)
- Read the [README](https://github.com/nodelibraries/enhanced-abort-controller#readme) for complete API documentation
