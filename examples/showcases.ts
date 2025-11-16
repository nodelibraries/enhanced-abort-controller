/**
 * Enhanced Abort Controller - Comprehensive Examples
 *
 * This file demonstrates all features and usage patterns of the Enhanced Abort Controller library.
 * Run this file with: npm run build && node dist/examples/showcases.js
 *
 * @author Enhanced Abort Controller Team
 * @version 1.1.0
 */

import {
  EnhancedAbortController,
  EnhancedAbortSignal,
  AbortError,
  TimeSpan,
} from '../src/index';

console.log('🚀 Enhanced Abort Controller - Comprehensive Examples\n');
console.log(
  '═══════════════════════════════════════════════════════════════\n'
);

// ============================================================================
// EXAMPLE 1: Basic EnhancedAbortController Usage
// ============================================================================
// Demonstrates the fundamental usage of EnhancedAbortController including:
// - Creating a controller
// - Registering abort callbacks
// - Manual abortion with reasons
// - Checking controller state
// ============================================================================
console.log('📋 Example 1: Basic EnhancedAbortController Usage');

const controller = new EnhancedAbortController();

// Register a callback for abort events
const registration = controller.signal.register(() => {
  console.log('⚠️  Operation was aborted!');
});

// Check initial state
console.log('Controller is aborted:', controller.isAborted);
console.log('Controller is disposed:', controller.isDisposed);
console.log('Signal is aborted:', controller.signal.isAborted);

// Abort the controller
controller.abort('Manual cancellation');
console.log('Controller is aborted after manual abort:', controller.isAborted);
console.log('Abort reason:', controller.reason);

// Unregister the callback
registration.unregister();

console.log('\n');

// ============================================================================
// EXAMPLE 2: Timeout-based Abortion
// ============================================================================
// Shows how to automatically abort a controller after a specified delay.
// Useful for implementing request timeouts and preventing long-running operations.
// ============================================================================
console.log('📋 Example 2: Timeout-based Abortion');

const timeoutController = new EnhancedAbortController();

// Abort after 3 seconds
timeoutController.abortAfter(3000);

timeoutController.signal.register(() => {
  console.log('⏰ Controller aborted after timeout!');
});

// Check timeout state
console.log('Controller will abort in 3 seconds...');
console.log('Controller is aborted:', timeoutController.isAborted);

console.log('\n');

// ============================================================================
// EXAMPLE 3: TimeSpan Integration
// ============================================================================
// Demonstrates the TimeSpan class for more readable and maintainable time intervals.
// TimeSpan provides multiple unit constructors and conversion properties.
// ============================================================================
console.log('📋 Example 3: TimeSpan Integration');

const timeSpanController = new EnhancedAbortController();

// Create TimeSpan objects
const timeSpanA = TimeSpan.fromSeconds(2);
const timeSpanB = TimeSpan.fromMinutes(0.1); // 6 seconds
const timeSpanC = TimeSpan.fromMilliseconds(1500);

console.log('TimeSpan A (2 seconds):', timeSpanA.milliseconds, 'ms');
console.log('TimeSpan B (0.1 minutes):', timeSpanB.milliseconds, 'ms');
console.log('TimeSpan C (1500ms):', timeSpanC.milliseconds, 'ms');

// Use TimeSpan with controller
timeSpanController.abortAfterTimeSpan(timeSpanA);

timeSpanController.signal.register(() => {
  console.log('⏰ Controller aborted using TimeSpan!');
});

console.log('\n');

// ============================================================================
// EXAMPLE 4: Linked Controllers
// ============================================================================
// Shows how to create a controller that aborts when ANY of the linked signals abort.
// Perfect for scenarios where you need to cancel an operation if any of multiple
// conditions are met (e.g., user cancellation OR timeout OR error condition).
// ============================================================================
console.log('📋 Example 4: Linked Controllers');

const controller1 = new EnhancedAbortController();
const controller2 = new EnhancedAbortController();
const controller3 = new EnhancedAbortController();

// Create linked controller
const linkedController = EnhancedAbortController.linkSignals(
  controller1.signal,
  controller2.signal,
  controller3.signal
);

linkedController.signal.register(() => {
  console.log('🔗 Linked controller aborted!');
});

// Abort one of the linked controllers
setTimeout(() => {
  console.log('Aborting controller1...');
  controller1.abort('Controller 1 aborted');
}, 1000);

console.log('\n');

// ============================================================================
// EXAMPLE 5: Static Signal Properties
// ============================================================================
console.log('📋 Example 5: Static Signal Properties');

// None signal (never aborts)
const noneSignal = EnhancedAbortSignal.none;
console.log('None signal is aborted:', noneSignal.isAborted);
console.log('None signal can be aborted:', noneSignal.canBeAborted);

// Already aborted signal
const abortedSignal = EnhancedAbortSignal.aborted;
console.log('Aborted signal is aborted:', abortedSignal.isAborted);
console.log('Aborted signal reason:', abortedSignal.reason);

// Test throwIfAborted with aborted signal
try {
  abortedSignal.throwIfAborted('Custom abort message');
} catch (error) {
  if (error instanceof AbortError) {
    console.log('✅ AbortError caught as expected:', error.message);
  }
}

console.log('\n');

// ============================================================================
// EXAMPLE 6: Static Timeout Methods
// ============================================================================
console.log('📋 Example 6: Static Timeout Methods');

// Create timeout controller
const timeoutControllerStatic = EnhancedAbortController.timeout(2500);
timeoutControllerStatic.signal.register(() => {
  console.log('⏰ Static timeout controller aborted!');
});

// Create timeout signal
const timeoutSignal = EnhancedAbortSignal.timeout(2000);
timeoutSignal.register(() => {
  console.log('⏰ Static timeout signal aborted!');
});

console.log('\n');

// ============================================================================
// EXAMPLE 7: Static Any Method
// ============================================================================
console.log('📋 Example 7: Static Any Method');

const signalA = new EnhancedAbortController();
const signalB = new EnhancedAbortController();
const signalC = new EnhancedAbortController();

const anySignal = EnhancedAbortSignal.any([
  signalA.signal,
  signalB.signal,
  signalC.signal,
]);

anySignal.register(() => {
  console.log('🔗 Any signal aborted!');
});

// Abort one of the signals
setTimeout(() => {
  console.log('Aborting signalB...');
  signalB.abort('Signal B aborted');
}, 1500);

console.log('\n');

// ============================================================================
// EXAMPLE 8: EnhancedAbortSignal Registration
// ============================================================================
console.log('📋 Example 8: EnhancedAbortSignal Registration');

const registrationController = new EnhancedAbortController();

// Multiple registrations
const registration1 = registrationController.signal.register(() => {
  console.log('📝 Registration 1 called');
});

const registration2 = registrationController.signal.register(() => {
  console.log('📝 Registration 2 called');
});

// Unregister one registration (registration2 will remain active)
setTimeout(() => {
  console.log('Unregistering registration 1...');
  registration1.unregister();
  // registration2 is intentionally kept to demonstrate multiple registrations
  void registration2;
}, 500);

// Abort after unregister
setTimeout(() => {
  console.log('Aborting controller...');
  registrationController.abort('Registration test');
}, 1000);

console.log('\n');

// ============================================================================
// EXAMPLE 10: whenAborted Promise
// ============================================================================
console.log('📋 Example 10: whenAborted Promise');

const promiseController = new EnhancedAbortController();

// Use whenAborted promise
promiseController.signal.whenAborted.then(() => {
  console.log('✅ whenAborted promise resolved!');
});

// Abort after delay
setTimeout(() => {
  console.log('Aborting controller for whenAborted test...');
  promiseController.abort('Promise test');
}, 1200);

console.log('\n');

// ============================================================================
// EXAMPLE 13: AbortError with Custom Messages
// ============================================================================
console.log('📋 Example 13: AbortError with Custom Messages');

const errorController = new EnhancedAbortController();

// Test throwIfAborted with custom message
try {
  errorController.signal.throwIfAborted('Custom abort message');
  console.log('✅ Signal not aborted, continuing...');
} catch (error) {
  if (error instanceof AbortError) {
    console.log('❌ AbortError caught:', error.message);
  }
}

// Abort and test again
errorController.abort('Test abort');
try {
  errorController.signal.throwIfAborted('Custom message after abort');
} catch (error) {
  if (error instanceof AbortError) {
    console.log('✅ AbortError caught after abort:', error.message);
  }
}

console.log('\n');

// ============================================================================
// EXAMPLE 14: TimeSpan Calculations
// ============================================================================
console.log('📋 Example 14: TimeSpan Calculations');

// Create TimeSpan with different units
const timeSpan1 = TimeSpan.fromMilliseconds(3661000); // 1 hour, 1 minute, 1 second
const timeSpan2 = TimeSpan.fromSeconds(90);
const timeSpan3 = TimeSpan.fromMinutes(1.5);
const timeSpan4 = TimeSpan.fromHours(2.5);
const timeSpan5 = TimeSpan.fromDays(1.5);

console.log('TimeSpan 1 (3661000ms):');
console.log('  - Milliseconds:', timeSpan1.milliseconds);
console.log('  - Total seconds:', timeSpan1.totalSeconds);
console.log('  - Total minutes:', timeSpan1.totalMinutes);
console.log('  - Total hours:', timeSpan1.totalHours);
console.log('  - Total days:', timeSpan1.totalDays);

console.log('TimeSpan 2 (90 seconds):');
console.log('  - Total minutes:', timeSpan2.totalMinutes);

console.log('TimeSpan 3 (1.5 minutes):');
console.log('  - Total seconds:', timeSpan3.totalSeconds);

console.log('TimeSpan 4 (2.5 hours):');
console.log('  - Total minutes:', timeSpan4.totalMinutes);

console.log('TimeSpan 5 (1.5 days):');
console.log('  - Total hours:', timeSpan5.totalHours);

// Static properties
console.log('TimeSpan.zero milliseconds:', TimeSpan.zero.milliseconds);
console.log('TimeSpan.maxValue milliseconds:', TimeSpan.maxValue.milliseconds);
console.log('TimeSpan.minValue milliseconds:', TimeSpan.minValue.milliseconds);

console.log('\n');

// ============================================================================
// EXAMPLE 15: AbortRegistration Management
// ============================================================================
console.log('📋 Example 15: AbortRegistration Management');

const regController = new EnhancedAbortController();

// Create registration
const reg = regController.signal.register(() => {
  console.log('📝 Registration callback called');
});

console.log('Registration is disposed:', reg.isDisposed);

// Unregister
reg.unregister();
console.log('Registration is disposed after unregister:', reg.isDisposed);

// Try to unregister again (should be no-op)
reg.unregister();
console.log(
  'Registration is disposed after second unregister:',
  reg.isDisposed
);

// Abort controller (should not trigger callback)
regController.abort('Registration test');

console.log('\n');

// ============================================================================
// EXAMPLE 16: Complex Async Workflow
// ============================================================================
// Demonstrates a real-world scenario with multiple async steps that can be cancelled.
// Shows proper error handling and cleanup patterns for production applications.
// ============================================================================
console.log('📋 Example 16: Complex Async Workflow');

async function complexWorkflow(signal: EnhancedAbortSignal) {
  console.log('🔄 Starting complex workflow...');

  try {
    // Step 1: Data preparation
    signal.throwIfAborted();
    console.log('📊 Step 1: Preparing data...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 2: Data processing
    signal.throwIfAborted();
    console.log('⚙️  Step 2: Processing data...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 3: Data validation
    signal.throwIfAborted();
    console.log('✅ Step 3: Validating data...');
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 4: Final processing
    signal.throwIfAborted();
    console.log('🎯 Step 4: Final processing...');
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

const workflowController = new EnhancedAbortController();

// Start workflow
complexWorkflow(workflowController.signal);

// Abort after 1.5 seconds
setTimeout(() => {
  console.log('🛑 Aborting complex workflow...');
  workflowController.abort('User cancelled workflow');
}, 1500);

console.log('\n');

// ============================================================================
// EXAMPLE 17: Multiple Controllers with Different Strategies
// ============================================================================
console.log('📋 Example 17: Multiple Controllers with Different Strategies');

// Controller with immediate abort
const immediateController = new EnhancedAbortController();
immediateController.signal.register(() => {
  console.log('⚡ Immediate controller aborted');
});

// Controller with timeout
const timeoutController2 = EnhancedAbortController.timeout(3000);
timeoutController2.signal.register(() => {
  console.log('⏰ Timeout controller aborted');
});

// Controller with TimeSpan
const timeSpanController2 = new EnhancedAbortController();
timeSpanController2.abortAfterTimeSpan(TimeSpan.fromSeconds(2.5));
timeSpanController2.signal.register(() => {
  console.log('📅 TimeSpan controller aborted');
});

// Abort immediate controller after 1 second
setTimeout(() => {
  console.log('🛑 Aborting immediate controller...');
  immediateController.abort('Immediate abort');
}, 1000);

console.log('\n');

// ============================================================================
// EXAMPLE 18: Error Handling Patterns
// ============================================================================
console.log('📋 Example 18: Error Handling Patterns');

const errorPatternController = new EnhancedAbortController();

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
pattern1(errorPatternController.signal);
pattern2(errorPatternController.signal);
pattern3(errorPatternController.signal);

// Abort after delay
setTimeout(() => {
  console.log('🛑 Aborting for error pattern tests...');
  errorPatternController.abort('Error pattern test');
}, 800);

console.log('\n');

// ============================================================================
// EXAMPLE 19: Performance Monitoring
// ============================================================================
console.log('📋 Example 19: Performance Monitoring');

const perfController = new EnhancedAbortController();
const startTime = Date.now();

// Monitor performance with abort capability
const perfRegistration = perfController.signal.register(() => {
  const elapsed = Date.now() - startTime;
  console.log(`⏱️  Performance monitoring aborted after ${elapsed}ms`);
});

// Simulate long-running operation
setTimeout(() => {
  console.log('🛑 Aborting performance monitoring...');
  perfController.abort('Performance timeout');
  // perfRegistration callback will be triggered automatically
  void perfRegistration;
}, 2000);

console.log('\n');

// ============================================================================
// EXAMPLE 20: Resource Cleanup
// ============================================================================
// Shows how to properly clean up resources when an operation is aborted.
// This pattern is essential for preventing memory leaks and resource exhaustion.
// ============================================================================
console.log('📋 Example 20: Resource Cleanup');

const cleanupController = new EnhancedAbortController();

// Simulate resource allocation
let resources = ['Resource 1', 'Resource 2', 'Resource 3'];
console.log('📦 Allocated resources:', resources);

const cleanupRegistration = cleanupController.signal.register(() => {
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
  console.log('🛑 Aborting work...');
  cleanupController.abort('Resource cleanup test');
}, 1000);

console.log('\n');

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log(
  '\n═══════════════════════════════════════════════════════════════\n'
);
console.log('🎉 All examples completed!\n');
console.log(
  '📚 This demonstrates all features of the Enhanced Abort Controller library:\n'
);
console.log('   ✅ EnhancedAbortController with timeout and disposal');
console.log('   ✅ EnhancedAbortSignal with registration and promise support');
console.log('   ✅ TimeSpan for time interval management');
console.log('   ✅ AbortRegistration for callback management');
console.log('   ✅ AbortError for proper error handling');
console.log('   ✅ Static methods for common patterns');
console.log('   ✅ Linked controllers and signal combinations');
console.log('   ✅ Promise-based waiting with whenAborted');
console.log('   ✅ Resource cleanup and disposal patterns');
console.log(
  '\n═══════════════════════════════════════════════════════════════\n'
);
console.log('📖 For more information, visit:');
console.log(
  '   - GitHub: https://github.com/nodelibraries/enhanced-abort-controller'
);
console.log(
  '   - npm: https://www.npmjs.com/package/@nodelibraries/enhanced-abort-controller'
);
console.log(
  '   - Docs: https://nodelibraries.github.io/enhanced-abort-controller'
);
console.log('\n');
