# Basic Usage

Basic example of using Enhanced AbortController.

```typescript
import { EnhancedAbortController } from '@nodelibraries/enhanced-abort-controller';

const controller = new EnhancedAbortController();

// Register a callback
controller.signal.register(() => {
  console.log('⚠️ Operation was aborted!');
});

// Abort after 5 seconds
controller.abortAfter(5000);

// Use with fetch
fetch('https://api.example.com/data', {
  signal: controller.signal.signal,
}).catch((err) => {
  if (err.name === 'AbortError') {
    console.log('Request was cancelled');
  }
});
```
