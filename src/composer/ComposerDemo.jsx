import React, { useState } from 'react';
import { ChannelComposer, ThreadComposer, EditMessageComposer } from './ComposerExamples';

/**
 * ComposerDemo - Showcases all three composer variations
 * 
 * This demonstrates:
 * 1. How the same provider can be composed differently
 * 2. How different UIs can emerge from the same foundation
 * 3. How state is managed without prop drilling
 * 4. How actions bubble up without need for callback chains
 */
export function ComposerDemo() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'channel',
      channel: 'general',
      content: 'Hey team, check out this new feature!',
      attachments: [],
    },
  ]);
  
  const [editingMessageId, setEditingMessageId] = useState(null);

  const handleChannelMessage = async (data) => {
    console.log('Channel message submitted:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        ...data,
      },
    ]);
  };

  const handleThreadReply = async (data) => {
    console.log('Thread reply submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        ...data,
      },
    ]);
  };

  const handleEditMessage = async (data) => {
    console.log('Message edit submitted:', data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId
          ? { ...msg, content: data.content }
          : msg
      )
    );
    setEditingMessageId(null);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React Composition Pattern Demo</h1>
      <p>
        Following Fernando Rojo's "Composition Is All You Need" principles
      </p>

      <section style={{ marginTop: '40px' }}>
        <h2>Channel Composer</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          A composer for posting messages to a channel. Includes attachment and emoji buttons.
        </p>
        <ChannelComposer
          channelName="general"
          onSendMessage={handleChannelMessage}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Thread Composer</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          A composer for replying in a thread. Simplified UI with only mention functionality.
        </p>
        <ThreadComposer
          threadId="thread-1"
          channelName="general"
          onReplyToThread={handleThreadReply}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Edit Message Composer</h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          A composer for editing an existing message. Different visual treatment and actions.
        </p>
        {editingMessageId && (
          <EditMessageComposer
            messageId={editingMessageId}
            currentContent={
              messages.find((m) => m.id === editingMessageId)?.content || ''
            }
            onSaveEdit={handleEditMessage}
          />
        )}
        {!editingMessageId && (
          <button
            onClick={() => setEditingMessageId(messages[0]?.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#007a5e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Edit First Message
          </button>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Messages Log</h2>
        <div style={{ fontSize: '12px' }}>
          {messages.length === 0 ? (
            <p style={{ color: '#999' }}>No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  borderLeft: '3px solid #007a5e',
                }}
              >
                <strong>[{msg.type}]</strong> {msg.content}
                {msg.attachments?.length > 0 && (
                  <div style={{ marginTop: '4px', color: '#666' }}>
                    Attachments: {msg.attachments.map((a) => a.name).join(', ')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <section style={{ marginTop: '60px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Key Principles Demonstrated</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <li>
            <strong>No Boolean Prop Hell:</strong> Instead of passing isThreadComposer, isEditMode, etc.,
            the caller decides the composition structure.
          </li>
          <li>
            <strong>Provider Pattern:</strong> State is managed in ComposerProvider and accessed via context,
            not passed as props down the tree.
          </li>
          <li>
            <strong>No Prop Drilling:</strong> Components like ComposerButton and action buttons access state
            directly from context, even though they're deep in the tree.
          </li>
          <li>
            <strong>Decoupled Implementation:</strong> The same ComposerProvider can work with useState, Redux,
            Zustand, or any state management library by passing a custom useStateFn.
          </li>
          <li>
            <strong>Flexible Composition:</strong> UI elements are composed as JSX children, not selected
            via conditional render logic in the parent component.
          </li>
          <li>
            <strong>Maintainable & Scalable:</strong> New composer variations can be created without
            modifying existing components or adding more boolean props.
          </li>
        </ul>
      </section>
    </div>
  );
}

export default ComposerDemo;
