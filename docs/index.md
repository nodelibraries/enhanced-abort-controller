---
layout: home

hero:
  name: '@nodelibraries/enhanced-abort-controller'
  text: Enhanced AbortController
  tagline: |
    Enhanced AbortController with Node.js-style patterns for modern TypeScript applications.
    Clean, fully type-safe with zero external libraries.

    Built on top of the native Web API AbortController.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/nodelibraries/enhanced-abort-controller

features:
  - icon: 🎯
    title: Type-Safe
    details: Full TypeScript support with type inference and compile-time safety
  - icon: ⏱️
    title: Timeout Support
    details: Automatic timeout-based cancellation with TimeSpan support
  - icon: 🔗
    title: Linked Controllers
    details: Create controllers that abort when any linked signal aborts
  - icon: 📦
    title: Lightweight
    details: Zero dependencies - pure TypeScript implementation
  - icon: 🔄
    title: Promise Support
    details: Promise-based waiting with whenAborted for async workflows
  - icon: 🧹
    title: Resource Cleanup
    details: Automatic resource cleanup with registration callbacks
  - icon: ⚡
    title: Disposal Pattern
    details: Proper disposal pattern for resource management
  - icon: 🛡️
    title: Error Handling
    details: Custom AbortError with proper error inheritance
---

## Quick Start

```bash
npm install @nodelibraries/enhanced-abort-controller
```

```typescript
import { EnhancedAbortController } from '@nodelibraries/enhanced-abort-controller';

const controller = new EnhancedAbortController();
controller.abortAfter(5000); // Abort after 5 seconds

// Use with fetch
fetch('https://api.example.com/data', {
  signal: controller.signal.signal
}).catch(err => {
  if (err.name === 'AbortError') {
    console.log('Request was cancelled');
  }
});
```

## Why @nodelibraries/enhanced-abort-controller?

**@nodelibraries/enhanced-abort-controller** is an enhanced version of the native `AbortController` with additional features for modern Node.js and TypeScript applications. It provides timeout-based cancellation, linked controllers, and proper resource cleanup patterns.

> Learn more about our features and design principles in the [Introduction](/guide/) guide.

### 🎯 Clean & Simple

No decorators, no annotations, no framework lock-in. Your code remains pure and framework-agnostic.

```typescript
// Clean, simple usage
const controller = new EnhancedAbortController();
controller.abortAfter(5000); // Auto-abort after 5 seconds
```

### 🔒 Type-Safe by Design

Built from the ground up for TypeScript. Full type inference, autocomplete, and compile-time safety.

```typescript
// Full type safety with autocomplete
const controller = new EnhancedAbortController();
controller.signal.throwIfAborted(); // ✅ TypeScript knows this method exists
```

### 🚀 Production Ready

Battle-tested features including timeout management, linked controllers, and comprehensive error handling.

```typescript
// Linked controllers for complex scenarios
const userController = new EnhancedAbortController();
const timeoutController = EnhancedAbortController.timeout(10000);

// Abort if user cancels OR timeout occurs
const linked = EnhancedAbortController.linkSignals(
  userController.signal,
  timeoutController.signal
);
```

### 🔄 Enhanced Features

Additional features beyond the native AbortController:

- **Timeout Support** - Automatic timeout-based cancellation
- **Linked Controllers** - Combine multiple abort signals
- **TimeSpan** - Precise time interval management
- **Resource Cleanup** - Automatic cleanup callbacks
- **Promise Support** - `whenAborted` promise for async workflows

### 🎨 Flexible Usage

Use with:

- **Native fetch API** - Direct integration with fetch
- **Axios** - Works seamlessly with Axios
- **Custom async operations** - Any async operation that supports AbortSignal
- **Resource management** - Automatic cleanup patterns

## Installation

```bash
npm install @nodelibraries/enhanced-abort-controller
```

No additional configuration required! The library has zero dependencies and works out of the box.

## Next Steps

- Read the [Getting Started Guide](/guide/)
- Check out [Examples](/examples/)
- Browse the [API Reference](/api/)

