/**
 * Testing Utilities for Composition Pattern
 * =========================================
 * 
 * Separated into its own file to enable Fast Refresh and avoid jest dependency
 * in component files.
 */

/**
 * Create a mock function for testing
 * Used in place of jest.fn() for non-test environments
 */
function createMockFn() {
  const calls = [];
  const mockFn = (...args) => {
    calls.push(args);
    return Promise.resolve();
  };
  mockFn.calls = calls;
  return mockFn;
}

/**
 * Test Utilities for Context Consumers
 * 
 * These utilities help you test components that use useComposer()
 */
export const createMockComposerValue = (overrides = {}) => ({
  content: 'Test message',
  attachments: [],
  metadata: {},
  isSubmitting: false,
  updateContent: createMockFn(),
  addAttachment: createMockFn(),
  removeAttachment: createMockFn(),
  updateMetadata: createMockFn(),
  submit: createMockFn(),
  reset: createMockFn(),
  ...overrides,
});

/**
 * Default mock value for testing
 */
export const createDefaultMockComposerValue = () => ({
  content: '',
  attachments: [],
  metadata: {},
  isSubmitting: false,
  updateContent: createMockFn(),
  addAttachment: createMockFn(),
  removeAttachment: createMockFn(),
  updateMetadata: createMockFn(),
  submit: createMockFn(),
  reset: createMockFn(),
});
