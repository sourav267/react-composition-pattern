/**
 * ADVANCED COMPOSITION PATTERNS
 * =============================
 * 
 * This file demonstrates more advanced usage patterns and techniques
 * for working with the composition pattern implementation.
 */

import React, { useState } from 'react';
import { ComposerProvider } from './ComposerContext';
import { useComposer } from './ComposerContextValue';
import { useReduxComposerState } from './advancedHooks';
import {
  ComposerContainer,
  ComposerInput,
  ComposerFooter,
  ComposerActions,
  ComposerButton,
  ComposerAttachments,
} from './ComposerComponents';

// ============================================================
// PATTERN 1: Custom State Management Integration
// ============================================================

/**
 * Example: Using a custom state hook instead of useState
 * This demonstrates how the provider can work with any state management solution.
 */
export function ReduxComposerExample({ onSubmit }) {
  return (
    <ComposerProvider
      onSubmit={onSubmit}
      useStateFn={useReduxComposerState}
    >
      <ComposerContainer>
        <ComposerInput />
        <ComposerFooter>
          <ComposerActions>
            <ComposerButton>Redux State</ComposerButton>
          </ComposerActions>
          <ComposerButton variant="primary">Send</ComposerButton>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}

// ============================================================
// PATTERN 2: Render Props Inside Composer Footer
// ============================================================

/**
 * Example: Using render props pattern alongside composition
 * Shows how composition and render props can coexist.
 */
export function ComposerWithRenderProps({ onSubmit, renderActions }) {
  return (
    <ComposerProvider onSubmit={onSubmit}>
      <ComposerContainer>
        <ComposerInput />
        <ComposerAttachments />
        <ComposerFooter>
          <ComposerActions>
            {renderActions ? renderActions() : <DefaultActions />}
          </ComposerActions>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}

function DefaultActions() {
  const { submit, content } = useComposer();
  return (
    <ComposerButton
      variant="primary"
      onClick={() => submit()}
      disabled={!content.trim()}
    >
      Send
    </ComposerButton>
  );
}

// ============================================================
// PATTERN 3: Composing Context Consumers as Siblings
// ============================================================

/**
 * Example: Components that consume context but render as siblings
 * This shows the power of composition - elements can be scattered
 * throughout the tree but still access shared state.
 */
export function ComposerWithSidePanel({ onSubmit }) {
  return (
    <ComposerProvider onSubmit={onSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '16px' }}>
        <ComposerContainer>
          <ComposerInput />
          <ComposerAttachments />
          <ComposerFooter>
            <ComposerActions>
              <FormattingTools />
            </ComposerActions>
            <ComposerButton variant="primary">Send</ComposerButton>
          </ComposerFooter>
        </ComposerContainer>

        {/* Side panel - also consuming context, no prop drilling needed */}
        <ComposerSidePanel />
      </div>
    </ComposerProvider>
  );
}

function FormattingTools() {
  return (
    <>
      <ComposerButton title="Bold">B</ComposerButton>
      <ComposerButton title="Italic">I</ComposerButton>
      <ComposerButton title="Code">`</ComposerButton>
    </>
  );
}

function ComposerSidePanel() {
  const { content, attachments } = useComposer();

  return (
    <div
      style={{
        padding: '12px',
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
        border: '1px solid #eee',
        fontSize: '12px',
      }}
    >
      <h4 style={{ margin: '0 0 8px 0' }}>Message Preview</h4>

      {content ? (
        <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {content}
        </p>
      ) : (
        <p style={{ margin: '8px 0', color: '#999', fontStyle: 'italic' }}>
          No content yet
        </p>
      )}

      <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #ddd' }} />

      <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>Stats:</p>
      <p style={{ margin: '0', color: '#666' }}>
        Characters: {content.length}
      </p>
      <p style={{ margin: '0', color: '#666' }}>
        Words: {content.split(/\s+/).filter(Boolean).length}
      </p>
      <p style={{ margin: '0', color: '#666' }}>
        Files: {attachments.length}
      </p>
    </div>
  );
}

// ============================================================
// PATTERN 4: Higher-Order Component Wrapper
// ============================================================

/**
 * See advancedUtils.js for withComposerTracking HOC
 */

// ============================================================
// PATTERN 5: Composing Multiple Providers
// ============================================================

/**
 * Example: Nesting multiple composers with different contexts
 * Shows that the pattern supports complex hierarchies.
 */
export function ParentComposerWithNestedReply({ onSendMessage, onReplyToThread }) {
  const [selectedThreadId, setSelectedThreadId] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* Main composer */}
      <div style={{ flex: 1 }}>
        <h3>Main Channel</h3>
        <ComposerProvider onSubmit={onSendMessage}>
          <ComposerContainer>
            <ComposerInput placeholder="Message the channel..." />
            <ComposerFooter>
              <ComposerButton variant="primary">Send</ComposerButton>
            </ComposerFooter>
          </ComposerContainer>
        </ComposerProvider>
      </div>

      {/* Nested thread reply composer */}
      {selectedThreadId && (
        <div style={{ flex: 1 }}>
          <h3>Thread Reply</h3>
          <ComposerProvider onSubmit={onReplyToThread}>
            <ComposerContainer style={{ backgroundColor: '#f0f0f0' }}>
              <ComposerInput placeholder="Reply in thread..." />
              <ComposerFooter>
                <ComposerButton onClick={() => setSelectedThreadId(null)}>
                  Close
                </ComposerButton>
                <ComposerButton variant="primary">Reply</ComposerButton>
              </ComposerFooter>
            </ComposerContainer>
          </ComposerProvider>
        </div>
      )}

      {!selectedThreadId && (
        <button
          onClick={() => setSelectedThreadId('thread-1')}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007a5e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Open Thread
        </button>
      )}
    </div>
  );
}

// ============================================================
// PATTERN 6: Custom Composition Hooks
// ============================================================

/**
 * See advancedHooks.js for useComposerWithTypingIndicator hook
 */

export function ComposerWithTypingIndicator({ onSubmit, onTyping }) {
  return (
    <ComposerProvider onSubmit={onSubmit}>
      <ComposerContainer>
        <ComposerInput />
        <TypingIndicator onTypingChange={onTyping} />
        <ComposerFooter>
          <ComposerButton variant="primary">Send</ComposerButton>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}

function TypingIndicator({ onTypingChange }) {
  const { content } = useComposer();
  const isTyping = content.length > 0;

  React.useEffect(() => {
    onTypingChange?.(isTyping);
  }, [isTyping, onTypingChange]);

  return null; // Invisible component, just handles side effects
}
