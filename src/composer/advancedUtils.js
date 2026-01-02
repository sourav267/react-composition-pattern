/**
 * Advanced Utilities and Higher-Order Components
 * ==============================================
 * 
 * Separated into its own file to enable Fast Refresh in development.
 * Fast Refresh requires that component-exporting files don't also export
 * non-component values (like HOCs and utility functions).
 */

import { useState } from 'react';

/**
 * Higher-Order Component: withComposerTracking
 * 
 * Wraps a composer component with additional logic to track message count.
 * Shows how composition patterns work with traditional HOC patterns.
 */
// eslint-disable-next-line no-unused-vars
export function withComposerTracking(ComposerComponent) {
  return function TrackedComposer(props) {
    const [messageCount, setMessageCount] = useState(0);

    const handleSubmit = async (data) => {
      console.log(`Message #${messageCount + 1}:`, data);
      setMessageCount((prev) => prev + 1);

      if (props.onSubmit) {
        await props.onSubmit(data);
      }
    };

    return (
      <div>
        <div style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>
          Messages sent: {messageCount}
        </div>
        <ComposerComponent {...props} onSubmit={handleSubmit} />
      </div>
    );
  };
}
