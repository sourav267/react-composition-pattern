import React from 'react';
import { ComposerProvider } from './ComposerContext';
import { useComposer } from './ComposerContextValue';
import {
  ComposerContainer,
  ComposerInput,
  ComposerFooter,
  ComposerActions,
  ComposerButton,
  ComposerAttachments,
} from './ComposerComponents';

/**
 * ChannelComposer - Composition example #1
 * 
 * Demonstrates how the SAME provider and components can be composed
 * differently for different contexts, without conditional rendering
 * or boolean prop hell.
 * 
 * Key principle: The interface (JSX structure) is determined by the caller,
 * not by the component. This is pure composition.
 */
export function ChannelComposer({ channelName, onSendMessage }) {
  return (
    <ComposerProvider
      onSubmit={async (data) => {
        await onSendMessage({
          type: 'channel',
          channel: channelName,
          ...data,
        });
      }}
    >
      <ComposerContainer>
        <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>
          Message #{channelName}
        </div>
        
        <ComposerInput placeholder={`Message #${channelName}`} />
        <ComposerAttachments />

        <ComposerFooter>
          <ComposerActions>
            <ChannelAttachButton />
            <ChannelEmojiButton />
          </ComposerActions>

          <SubmitButton />
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}

/**
 * ThreadComposer - Composition example #2
 * 
 * Same provider, completely different composition.
 * The thread context is stored in metadata, allowing the provider
 * to remain generic while the caller determines structure.
 */
export function ThreadComposer({ threadId, channelName, onReplyToThread }) {
  return (
    <ComposerProvider
      onSubmit={async (data) => {
        await onReplyToThread({
          type: 'thread_reply',
          threadId,
          channel: channelName,
          ...data,
        });
      }}
    >
      <ComposerContainer style={{ backgroundColor: '#f9f9f9' }}>
        <div
          style={{
            fontSize: '12px',
            color: '#999',
            fontWeight: '500',
            paddingBottom: '8px',
            borderBottom: '1px solid #eee',
          }}
        >
          Replying in thread • #{channelName}
        </div>

        <ComposerInput placeholder="Reply in thread..." />
        <ComposerAttachments />

        <ComposerFooter>
          <ComposerActions>
            <ThreadMentionButton />
          </ComposerActions>

          <div style={{ display: 'flex', gap: '8px' }}>
            <CancelButton />
            <SubmitButton variant="primary" />
          </div>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}

/**
 * EditMessageComposer - Composition example #3
 * 
 * Yet another variation. Notice how the composer works the same way,
 * but the composition is different because this is an edit context,
 * not a new message context.
 */
export function EditMessageComposer({ messageId, currentContent, onSaveEdit }) {
  return (
    <ComposerProvider
      initialValue={currentContent}
      onSubmit={async (data) => {
        await onSaveEdit({
          type: 'edit_message',
          messageId,
          ...data,
        });
      }}
    >
      <ComposerContainer style={{ borderColor: '#ffb703', backgroundColor: '#fffbf0' }}>
        <div
          style={{
            fontSize: '12px',
            color: '#ff9500',
            fontWeight: '500',
          }}
        >
          Editing message
        </div>

        <ComposerInput placeholder="Edit your message..." />

        <ComposerFooter>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <EditCancelButton />
            <SaveEditButton />
          </div>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}

// ============================================================
// Composed action buttons - These are JSX compositions, not render props
// They access context directly, demonstrating no prop drilling
// ============================================================

/**
 * ChannelAttachButton - Context-aware action
 * 
 * This button lives OUTSIDE the direct composer hierarchy in the JSX,
 * but can still access and manipulate composer state because it's
 * within the ComposerProvider tree.
 */
function ChannelAttachButton() {
  const { addAttachment } = useComposer();

  const handleAttach = () => {
    // Simulate file selection
    const fakeFile = {
      id: Date.now(),
      name: 'document.pdf',
      size: '2.4 MB',
    };
    addAttachment(fakeFile);
  }

  return (
    <ComposerButton onClick={handleAttach} title="Attach file">
      📎 Attach
    </ComposerButton>
  );
}

function ChannelEmojiButton() {
  return (
    <ComposerButton title="Add emoji">
      😊 Emoji
    </ComposerButton>
  );
}

function ThreadMentionButton() {
  return (
    <ComposerButton title="Mention member">
      @ Mention
    </ComposerButton>
  );
}

function SubmitButton({ variant = 'primary' }) {
  const { submit, content, isSubmitting } = useComposer();

  return (
    <ComposerButton
      variant={variant}
      onClick={() => submit()}
      disabled={!content.trim()}
    >
      {isSubmitting ? 'Sending...' : 'Send'}
    </ComposerButton>
  );
}

function CancelButton() {
  const { reset } = useComposer();

  return (
    <ComposerButton onClick={reset}>
      Cancel
    </ComposerButton>
  );
}

function EditCancelButton() {
  return (
    <ComposerButton>
      Cancel Edit
    </ComposerButton>
  );
}

function SaveEditButton() {
  const { submit, content, isSubmitting } = useComposer();

  return (
    <ComposerButton
      variant="primary"
      onClick={() => submit()}
      disabled={!content.trim()}
    >
      {isSubmitting ? 'Saving...' : 'Save Edit'}
    </ComposerButton>
  );
}

export {
  ChannelAttachButton,
  ChannelEmojiButton,
  ThreadMentionButton,
  SubmitButton,
  CancelButton,
  EditCancelButton,
  SaveEditButton,
};
