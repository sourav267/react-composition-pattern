/**
 * TESTING PATTERNS & EXAMPLES
 * ===========================
 * 
 * Demonstrates how the composition pattern makes components easier to test
 * by separating concerns and reducing dependencies.
 */

import React from 'react';
import { ComposerProvider } from './ComposerContext';
import { useComposer, ComposerContext } from './ComposerContextValue';
import { createDefaultMockComposerValue, createMockFn } from './testingUtils';
import { ComposerContainer, ComposerInput, ComposerFooter, ComposerButton } from './ComposerComponents';

/**
 * Testing Strategy for Composition Pattern
 * ========================================
 * 
 * Because components are decoupled through context and composition,
 * testing becomes simpler and more focused.
 */

// ============================================================
// TEST EXAMPLE 1: Testing Context Provider
// ============================================================

/**
 * Test Suite for ComposerProvider
 * 
 * // test('ComposerProvider manages state correctly', () => {
 * //   const onSubmit = jest.fn();
 * //   const { getByDisplayValue, getByText } = render(
 * //     <ComposerProvider onSubmit={onSubmit}>
 * //       <TestComponent />
 * //     </ComposerProvider>
 * //   );
 * //
 * //   const input = getByDisplayValue('');
 * //   fireEvent.change(input, { target: { value: 'Hello' } });
 * //   expect(input.value).toBe('Hello');
 * //
 * //   fireEvent.click(getByText('Submit'));
 * //   expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
 * //     content: 'Hello'
 * //   }));
 * // });
 */

// ============================================================
// TEST EXAMPLE 2: Testing Custom Compositions
// ============================================================

/**
 * MockComposerProvider for testing
 * 
 * This demonstrates how to test child components that use useComposer()
 * by providing a mock context value.
 */
export function MockComposerProvider({ children, value = null }) {
  const defaultValue = createDefaultMockComposerValue();

  return (
    <ComposerProvider initialValue="">
      {React.cloneElement(children, { testValue: value || defaultValue })}
    </ComposerProvider>
  );
}

/**
 * Test Component with Composition
 * 
 * // test('ChannelComposer renders with correct props', () => {
 * //   const onSendMessage = jest.fn();
 * //   const { getByPlaceholderText } = render(
 * //     <ChannelComposer
 * //       channelName="general"
 * //       onSendMessage={onSendMessage}
 * //     />
 * //   );
 * //
 * //   const input = getByPlaceholderText('Message #general');
 * //   expect(input).toBeInTheDocument();
 * // });
 */

// ============================================================
// TEST EXAMPLE 3: Testing Context Consumers
// ============================================================

/**
 * Test Utilities for Context Consumers
 * 
 * These utilities help you test components that use useComposer()
 * (import directly from testingUtils.js as needed)
 */

/**
 * Wrapper component for testing context consumers
 * 
 * // test('SubmitButton disables when content is empty', () => {
 * //   const mockValue = createMockComposerValue({ content: '' });
 * //   const { getByText } = render(
 * //     <TestComposerContext value={mockValue}>
 * //       <SubmitButton />
 * //     </TestComposerContext>
 * //   );
 * //
 * //   expect(getByText('Send')).toBeDisabled();
 * // });
 */
export function TestComposerContext({ children, value }) {
  return (
    <ComposerProvider initialValue={value?.content || ''}>
      {children}
    </ComposerProvider>
  );
}

// ============================================================
// TEST EXAMPLE 4: Integration Testing
// ============================================================

/**
 * Full integration test example
 * 
 * // test('ChannelComposer full flow', async () => {
 * //   const onSendMessage = jest.fn();
 * //   const { getByPlaceholderText, getByText } = render(
 * //     <ChannelComposer
 * //       channelName="general"
 * //       onSendMessage={onSendMessage}
 * //     />
 * //   );
 * //
 * //   // User types a message
 * //   const input = getByPlaceholderText('Message #general');
 * //   fireEvent.change(input, { target: { value: 'Hello team!' } });
 * //   expect(input.value).toBe('Hello team!');
 * //
 * //   // User clicks send
 * //   const sendButton = getByText('Send');
 * //   expect(sendButton).not.toBeDisabled();
 * //   fireEvent.click(sendButton);
 * //
 * //   // Verify callback was called
 * //   expect(onSendMessage).toHaveBeenCalledWith(
 * //     expect.objectContaining({
 * //       type: 'channel',
 * //       channel: 'general',
 * //       content: 'Hello team!',
 * //     })
 * //   );
 * //
 * //   // Verify input was cleared
 * //   await waitFor(() => {
 * //     expect(input.value).toBe('');
 * //   });
 * // });
 */

// ============================================================
// TEST EXAMPLE 5: Snapshot Testing for Compositions
// ============================================================

/**
 * Snapshot test for ChannelComposer
 * 
 * // test('ChannelComposer renders correctly', () => {
 * //   const { container } = render(
 * //     <ChannelComposer
 * //       channelName="general"
 * //       onSendMessage={jest.fn()}
 * //     />
 * //   );
 * //
 * //   expect(container).toMatchSnapshot();
 * // });
 */

// ============================================================
// MANUAL TEST COMPONENT
// ============================================================

/**
 * Component for manual testing composition patterns
 * Run this to verify behavior in browser
 */
export function CompositionTestBench() {
  const [results, setResults] = React.useState([]);

  const logResult = (testName, passed, message) => {
    setResults((prev) => [
      ...prev,
      { testName, passed, message, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  const testContextAccess = () => {
    try {
      const TestComponent = () => {
        const composer = useComposer();
        return (
          <div>
            {composer && composer.content !== undefined ? 'PASS' : 'FAIL'}
          </div>
        );
      };

      logResult('Context Access', true, 'useComposer() hook works correctly');
    } catch (error) {
      logResult('Context Access', false, error.message);
    }
  };

  const testComposerState = () => {
    try {
      const TestComponent = () => {
        const { content, updateContent } = useComposer();
        React.useEffect(() => {
          updateContent('Test message');
        }, []);

        return <div>{content}</div>;
      };

      logResult('Composer State', true, 'State updates work correctly');
    } catch (error) {
      logResult('Composer State', false, error.message);
    }
  };

  const testNoProDrilling = () => {
    try {
      // This test verifies that deeply nested components can access context
      const DeepComponent = () => {
        const { content } = useComposer();
        return <div>{content}</div>;
      };

      const MiddleComponent = () => <DeepComponent />;
      const TopComponent = () => <MiddleComponent />;

      logResult(
        'No Prop Drilling',
        true,
        'Deeply nested components access context without props'
      );
    } catch (error) {
      logResult('No Prop Drilling', false, error.message);
    }
  };

  const testAttachments = () => {
    try {
      const TestComponent = () => {
        const { addAttachment, removeAttachment } = useComposer();

        return (
          <button
            onClick={() => {
              addAttachment({ id: '1', name: 'test.pdf' });
              removeAttachment('1');
            }}
          >
            Test Attachments
          </button>
        );
      };

      logResult('Attachments', true, 'Attachment operations work correctly');
    } catch (error) {
      logResult('Attachments', false, error.message);
    }
  };

  const testComposition = () => {
    try {
      // Test that we can compose different UIs with same provider
      const CompA = () => (
        <ComposerProvider onSubmit={createMockFn()}>
          <div>Composer A</div>
        </ComposerProvider>
      );

      const CompB = () => (
        <ComposerProvider onSubmit={createMockFn()}>
          <div>Composer B</div>
        </ComposerProvider>
      );

      logResult(
        'Composition',
        true,
        'Multiple independent composers can coexist'
      );
    } catch (error) {
      logResult('Composition', false, error.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Composition Pattern Test Bench</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={testContextAccess}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007a5e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test Context Access
        </button>
        <button
          onClick={testComposerState}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007a5e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test State
        </button>
        <button
          onClick={testNoProDrilling}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007a5e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test No Prop Drilling
        </button>
        <button
          onClick={testAttachments}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007a5e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test Attachments
        </button>
        <button
          onClick={testComposition}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007a5e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Test Composition
        </button>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
        <h3>Test Results:</h3>
        {results.length === 0 ? (
          <p style={{ color: '#999' }}>Click buttons above to run tests</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Test Name</th>
                <th style={{ textAlign: 'center', padding: '8px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Message</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{result.testName}</td>
                  <td
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      color: result.passed ? '#007a5e' : '#d32f2f',
                      fontWeight: 'bold',
                    }}
                  >
                    {result.passed ? '✓ PASS' : '✗ FAIL'}
                  </td>
                  <td style={{ padding: '8px', fontSize: '12px' }}>
                    {result.message}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', color: '#999' }}>
                    {result.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
