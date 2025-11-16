# Express Integration

Real-world example of using Enhanced AbortController with Express.js for request timeout and cancellation.

## Basic Express Example

```typescript
import express from 'express';
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
} from '@nodelibraries/enhanced-abort-controller';

const app = express();

// Middleware to create abort controller for each request
app.use((req, res, next) => {
  const controller = new EnhancedAbortController();

  // Auto-abort after 30 seconds
  controller.abortAfter(30000);

  // Attach controller to request
  (req as any).abortController = controller;

  // Clean up when request finishes
  res.on('close', () => {
    controller.dispose();
  });

  next();
});

// Route handler with abort support
app.get('/api/data', async (req, res) => {
  const controller = (req as any).abortController as EnhancedAbortController;
  const signal = controller.signal;

  try {
    // Simulate async operation with abort support
    const data = await fetchData(signal);
    res.json(data);
  } catch (error) {
    if (error instanceof AbortError) {
      res.status(408).json({ error: 'Request timeout' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

async function fetchData(signal: EnhancedAbortSignal) {
  // Check if aborted before starting
  signal.throwIfAborted();

  // Simulate database query with abort support
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      resolve({ data: 'Some data' });
    }, 2000);

    // Register cleanup
    signal.register(() => {
      clearTimeout(timeout);
      reject(new AbortError('Operation aborted'));
    });
  });
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Advanced Express Example with Multiple Operations

```typescript
import express from 'express';
import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
  TimeSpan,
} from '@nodelibraries/enhanced-abort-controller';

const app = express();

// Middleware with configurable timeout
app.use((req, res, next) => {
  const timeout = req.query.timeout
    ? parseInt(req.query.timeout as string)
    : 30000;

  const controller = new EnhancedAbortController();
  controller.abortAfter(timeout);

  (req as any).abortController = controller;

  res.on('close', () => {
    controller.dispose();
  });

  next();
});

// Complex route with multiple async operations
app.get('/api/users/:id', async (req, res) => {
  const controller = (req as any).abortController as EnhancedAbortController;
  const signal = controller.signal;

  try {
    // Multiple operations that can be cancelled
    const [user, posts, comments] = await Promise.all([
      fetchUser(req.params.id, signal),
      fetchUserPosts(req.params.id, signal),
      fetchUserComments(req.params.id, signal),
    ]);

    res.json({ user, posts, comments });
  } catch (error) {
    if (error instanceof AbortError) {
      res.status(408).json({
        error: 'Request timeout',
        reason: controller.reason,
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

async function fetchUser(id: string, signal: EnhancedAbortSignal) {
  signal.throwIfAborted();

  // Simulate database query
  await delay(1000, signal);
  return { id, name: 'John Doe' };
}

async function fetchUserPosts(id: string, signal: EnhancedAbortSignal) {
  signal.throwIfAborted();

  // Simulate API call
  await delay(1500, signal);
  return [{ id: 1, title: 'Post 1' }];
}

async function fetchUserComments(id: string, signal: EnhancedAbortSignal) {
  signal.throwIfAborted();

  // Simulate external service call
  await delay(2000, signal);
  return [{ id: 1, text: 'Comment 1' }];
}

function delay(ms: number, signal: EnhancedAbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    signal.register(() => {
      clearTimeout(timeout);
      reject(new AbortError('Operation aborted'));
    });
  });
}

app.listen(3000);
```

## Express with Manual Cancellation

```typescript
import express from 'express';
import {
  EnhancedAbortController,
  AbortError,
} from '@nodelibraries/enhanced-abort-controller';

const app = express();
app.use(express.json());

// Store active requests
const activeRequests = new Map<string, EnhancedAbortController>();

app.post('/api/long-running-task', async (req, res) => {
  const taskId = req.body.taskId || `task-${Date.now()}`;
  const controller = new EnhancedAbortController();

  activeRequests.set(taskId, controller);

  try {
    // Long-running operation
    const result = await processLongTask(taskId, controller.signal);
    activeRequests.delete(taskId);
    res.json({ taskId, result, status: 'completed' });
  } catch (error) {
    activeRequests.delete(taskId);
    if (error instanceof AbortError) {
      res.status(499).json({ taskId, status: 'cancelled' });
    } else {
      res.status(500).json({ error: 'Task failed' });
    }
  }
});

// Cancel endpoint
app.post('/api/cancel-task', (req, res) => {
  const { taskId } = req.body;
  const controller = activeRequests.get(taskId);

  if (controller) {
    controller.abort('Cancelled by user');
    activeRequests.delete(taskId);
    res.json({ taskId, status: 'cancelled' });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

async function processLongTask(
  taskId: string,
  signal: EnhancedAbortSignal
): Promise<string> {
  for (let i = 0; i < 100; i++) {
    signal.throwIfAborted();
    await delay(100, signal);
    console.log(`Task ${taskId}: Progress ${i}%`);
  }
  return 'Task completed';
}

function delay(ms: number, signal: EnhancedAbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal.register(() => {
      clearTimeout(timeout);
      reject(new AbortError('Operation aborted'));
    });
  });
}

app.listen(3000);
```

## Express with Linked Controllers

```typescript
import express from 'express';
import {
  EnhancedAbortController,
  AbortError,
} from '@nodelibraries/enhanced-abort-controller';

const app = express();

app.use((req, res, next) => {
  // User cancellation controller
  const userController = new EnhancedAbortController();

  // Timeout controller (30 seconds)
  const timeoutController = EnhancedAbortController.timeout(30000);

  // Link both - abort if user cancels OR timeout occurs
  const linkedController = EnhancedAbortController.linkSignals(
    userController.signal,
    timeoutController.signal
  );

  (req as any).abortController = linkedController;
  (req as any).userController = userController;

  res.on('close', () => {
    userController.dispose();
    timeoutController.dispose();
  });

  next();
});

app.get('/api/data', async (req, res) => {
  const controller = (req as any).abortController as EnhancedAbortController;

  try {
    const data = await fetchData(controller.signal);
    res.json(data);
  } catch (error) {
    if (error instanceof AbortError) {
      res.status(408).json({ error: 'Request cancelled or timeout' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Manual cancellation endpoint
app.post('/api/cancel', (req, res) => {
  const userController = (req as any).userController as EnhancedAbortController;

  if (userController && !userController.isAborted) {
    userController.abort('Cancelled by user');
    res.json({ status: 'cancelled' });
  } else {
    res.status(400).json({ error: 'No active request to cancel' });
  }
});

async function fetchData(signal: EnhancedAbortSignal) {
  signal.throwIfAborted();
  await delay(5000, signal);
  return { data: 'Some data' };
}

function delay(ms: number, signal: EnhancedAbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal.register(() => {
      clearTimeout(timeout);
      reject(new AbortError('Operation aborted'));
    });
  });
}

app.listen(3000);
```

## Key Benefits

- **Automatic Timeout**: Requests automatically timeout after a specified duration
- **Resource Cleanup**: Automatic cleanup when requests finish or are cancelled
- **Error Handling**: Proper error handling for aborted operations
- **Manual Cancellation**: Support for manual request cancellation
- **Linked Controllers**: Combine user cancellation with timeout
