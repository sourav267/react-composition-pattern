# React Composition Pattern Implementation

A comprehensive implementation of Fernando Rojo's "Composition Is All You Need" principles applied to a Slack-like message composer component.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Problem It Solves](#problem-it-solves)
3. [Architecture](#architecture)
4. [Core Concepts](#core-concepts)
5. [Usage Examples](#usage-examples)
6. [Advanced Patterns](#advanced-patterns)
7. [Key Benefits](#key-benefits)

## Overview

This project demonstrates how to build scalable React components using composition instead of boolean props and conditional rendering. It uses a **Provider Pattern** to manage state and expose it through context hooks, allowing any component in the tree to access and manipulate state without prop drilling.

### What You'll Learn

- ✅ How to avoid "boolean prop hell"
- ✅ Provider pattern for state management
- ✅ Composition through JSX over conditional rendering
- ✅ Decoupled state implementation (swap useState, Redux, Zustand, etc.)
- ✅ Building flexible, maintainable component hierarchies
- ✅ State lifting without prop drilling

## Problem It Solves

### Traditional Approach: Boolean Prop Hell

```jsx
// ❌ This gets out of hand quickly
<Composer
  isThread={false}
  isEdit={false}
  isDraft={false}
  showAttachments={true}
  showEmoji={true}
  showMention={false}
  canSchedule={true}
  threadId={null}
  messageId={null}
  onSubmit={...}
  onCancel={...}
  // ... 20+ more props
/>
```

Problems:
- Hard to understand valid prop combinations
- Tight coupling between parent and child
- New variations require new props
- Hidden conditional logic inside component
- Difficult to test

### Composition Solution

```jsx
// ✅ Clear intent, flexible composition
<ChannelComposer onSendMessage={...} />
<ThreadComposer onReplyToThread={...} />
<EditMessageComposer onSaveEdit={...} />
```

Benefits:
- Each composer is a specific, tailored composition
- Easy to create new variations without modifying existing code
- Clear, explicit component structure
- No prop drilling
- Easier to test individual pieces

## Architecture

The implementation follows a 4-layer architecture:

### Layer 1: Context Provider
- **ComposerProvider**: Manages all state (content, attachments, metadata, isSubmitting)
- **useComposer()**: Hook to access state anywhere in the tree
- **Decoupled**: Works with useState, Redux, Zustand, or any state solution

### Layer 2: Primitive Components
- **ComposerInput**: Textarea connected to context
- **ComposerFooter**: Action container
- **ComposerActions**: Grouped action buttons
- **ComposerButton**: Reusable button with variants
- **ComposerAttachments**: Display attachment list
- **ComposerContainer**: Base layout wrapper

### Layer 3: Composition Examples
- **ChannelComposer**: Message to channel (attachments, emoji)
- **ThreadComposer**: Thread reply (simplified, mention option)
- **EditMessageComposer**: Edit existing message (different styling, save action)

### Layer 4: Context Consumers
- **Action Buttons**: Access context via useComposer(), render anywhere
- **Custom Logic**: Components can access and modify state without props

## Core Concepts

### 1. Provider Pattern

State is lifted to the highest level and exposed through context. This eliminates prop drilling throughout the component tree.

```jsx
<ComposerProvider onSubmit={handleSubmit}>
  <ComposerContainer>
    <ComposerInput />  {/* Accesses context */}
    <ComposerFooter>
      <SubmitButton />  {/* Also accesses context, no props needed */}
    </ComposerFooter>
  </ComposerContainer>
</ComposerProvider>
```

### 2. Composition Through JSX

Instead of conditional rendering inside a component based on props, the **caller** decides what to compose using JSX.

```jsx
// Bad: Component decides what to render
<Composer variant="channel">
  {/* Internal conditional logic renders different buttons */}
</Composer>

// Good: Caller composes what appears
<ChannelComposer>
  {/* Explicitly composes AttachButton and EmojiButton */}
</ChannelComposer>
```

### 3. Decoupled Implementation

The provider's interface is stable, but the implementation can change. You can use useState, Redux, Zustand, or any state management library:

```jsx
// Using useState (default)
<ComposerProvider onSubmit={handleSubmit}>
  {children}
</ComposerProvider>

// Using custom state hook
<ComposerProvider 
  onSubmit={handleSubmit}
  useStateFn={useGlobalComposerState}
>
  {children}
</ComposerProvider>
```

### 4. No Prop Drilling

Components access state directly through context hooks. Actions buttons can be positioned anywhere in the tree.

```jsx
// This button can be deep in the tree, not just immediate children
function SubmitButton() {
  const { submit, content } = useComposer();  // Direct context access
  return <button onClick={() => submit()}>Send</button>;
}
```

## Usage Examples

### Basic Channel Composer

```jsx
import { ChannelComposer } from './composer';

function MyApp() {
  const handleSendMessage = async (data) => {
    console.log('Message:', data.content);
    // API call to send message
  };

  return (
    <ChannelComposer 
      channelName="general" 
      onSendMessage={handleSendMessage}
    />
  );
}
```

### Custom Composer Composition

```jsx
import { 
  ComposerProvider, 
  ComposerContainer, 
  ComposerInput, 
  ComposerFooter,
  ComposerButton 
} from './composer';

function CustomComposer() {
  return (
    <ComposerProvider onSubmit={handleSubmit}>
      <ComposerContainer>
        <ComposerInput placeholder="Your custom placeholder" />
        
        <ComposerFooter>
          <div>Custom content on left</div>
          <ComposerButton variant="primary">Custom Action</ComposerButton>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}
```

### Using Context Directly

```jsx
import { ComposerProvider, useComposer } from './composer';

function MyCustomButton() {
  const { submit, content, metadata, updateMetadata } = useComposer();

  return (
    <button onClick={() => submit()}>
      Send ({content.length} chars)
    </button>
  );
}

function App() {
  return (
    <ComposerProvider onSubmit={handleSubmit}>
      <div>
        <input type="text" />
        <MyCustomButton />  {/* Accesses context, no props needed */}
      </div>
    </ComposerProvider>
  );
}
```

## Advanced Patterns

### Pattern 1: Custom State Management

```jsx
// Use Redux selectors instead of useState
function useReduxComposerState(key) {
  const dispatch = useDispatch();
  const value = useSelector(state => state.composer[key]);
  const setValue = (val) => dispatch(updateComposer(key, val));
  return [value, setValue];
}

<ComposerProvider 
  onSubmit={handleSubmit}
  useStateFn={useReduxComposerState}
>
  {children}
</ComposerProvider>
```

### Pattern 2: Context Consumers as Siblings

```jsx
// Composer and side panel both access same context
<ComposerProvider>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px' }}>
    <ComposerContainer>
      <ComposerInput />
    </ComposerContainer>
    
    <PreviewPanel />  {/* Also uses useComposer() */}
  </div>
</ComposerProvider>

function PreviewPanel() {
  const { content, attachments } = useComposer();
  // Renders preview of what's being typed
}
```

### Pattern 3: Nested Providers

```jsx
// Multiple composers with different contexts
<ComposerProvider onSubmit={sendMainMessage}>
  <MainComposer />
  
  {selectedThread && (
    <ComposerProvider onSubmit={replyToThread}>
      <ThreadComposer />
    </ComposerProvider>
  )}
</ComposerProvider>
```

### Pattern 4: Custom Hooks for Logic

```jsx
// Extract complex logic into custom hooks
function useComposerWithTypingIndicator() {
  const composer = useComposer();
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    // Notify others user is typing
    if (composer.content && isTyping) {
      notifyTyping();
    }
  }, [composer.content, isTyping]);
  
  return { ...composer, isTyping, setIsTyping };
}
```

## Key Benefits

### For Developers

1. **No Prop Hell**: State flows through context, not props
2. **Easy to Extend**: Add new composers without modifying existing code
3. **Clear Intent**: Component names and structure communicate purpose
4. **Testable**: Each piece has clear responsibilities
5. **Flexible**: Swap state management without touching components

### For Maintainers

1. **Scalable**: Grows without adding complexity
2. **Modular**: Components are independent and reusable
3. **Documented**: Code structure is self-documenting
4. **Refactorable**: Changes to one composer don't affect others
5. **AI-Friendly**: Clear patterns make code easier for AI tools to understand

### For Users

1. **Consistent**: All composers follow same patterns
2. **Intuitive**: UI matches the action (channel, thread, edit)
3. **Responsive**: Built with proper loading and disabled states
4. **Accessible**: Semantic HTML and proper keyboard support

## File Structure

```
src/composer/
├── ComposerContext.jsx       # Core provider and hook
├── ComposerComponents.jsx    # Primitive components
├── ComposerExamples.jsx      # Composition examples
├── ComposerDemo.jsx          # Demo and showcase
├── AdvancedPatterns.jsx      # Advanced usage patterns
├── ARCHITECTURE.md           # Detailed architecture docs
├── index.js                  # Main entry point
└── README.md                 # This file
```

## Getting Started

1. Import the composer you need:
   ```jsx
   import { ChannelComposer, ThreadComposer } from './composer';
   ```

2. Pass your handlers:
   ```jsx
   <ChannelComposer 
     channelName="general"
     onSendMessage={handleSendMessage}
   />
   ```

3. Or create custom compositions:
   ```jsx
   import { ComposerProvider, ComposerContainer, ComposerInput } from './composer';
   
   <ComposerProvider onSubmit={handleSubmit}>
     <ComposerContainer>
       <ComposerInput />
       {/* Add your custom UI */}
     </ComposerContainer>
   </ComposerProvider>
   ```

## References

- 📹 [Fernando Rojo - Composition Is All You Need](https://www.youtube.com/watch?v=WakUe-gJNMY)
- 📚 [React Context API](https://react.dev/reference/react/useContext)
- 📖 [Provider Pattern](https://www.patterns.dev/react/provider-pattern/)

## License

MIT
