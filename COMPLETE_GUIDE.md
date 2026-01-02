# Complete Guide to Using the Composition Pattern

## 🚀 Quick Start

### 1. Import the Composer You Need

```jsx
import { ChannelComposer, ThreadComposer, EditMessageComposer } from './composer';
```

### 2. Use It

```jsx
function MyApp() {
  const handleSendMessage = async (data) => {
    console.log('Message sent:', data);
    // Make API call
  };

  return (
    <ChannelComposer 
      channelName="general" 
      onSendMessage={handleSendMessage}
    />
  );
}
```

That's it! No prop drilling, no boolean props, no complexity.

---

## 📋 Files Overview

### Core Files

| File | Purpose |
|------|---------|
| `ComposerContext.jsx` | Context provider and hooks for state management |
| `ComposerComponents.jsx` | Primitive reusable components (Input, Footer, Button, etc.) |
| `ComposerExamples.jsx` | Pre-built composer variations (Channel, Thread, Edit) |
| `ComposerDemo.jsx` | Interactive demo showing all patterns |
| `AdvancedPatterns.jsx` | Advanced usage patterns and examples |
| `TestingPatterns.jsx` | Testing utilities and examples |
| `index.js` | Main export file |

### Documentation Files

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | Detailed architecture explanation |
| `README_COMPOSITION.md` | Complete guide with examples |
| `COMPLETE_GUIDE.md` | This file |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│    ComposerProvider                 │
│  (Manages State via Context)        │
│                                     │
│  • content                          │
│  • attachments                      │
│  • metadata                         │
│  • actions (updateContent, submit)  │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────┐    ┌────▼────────┐
│ Input    │    │ Footer       │
│          │    │              │
│ Reads:   │    │ • Actions    │
│ content  │    │ • Buttons    │
│          │    │              │
│ Writes:  │    │ All use      │
│ content  │    │ useComposer()│
└──────────┘    └──────────────┘
```

### The Three Layers of Composition

**Layer 1: Provider**
- Manages all state
- Exposes via context hook
- Stable interface, swappable implementation

**Layer 2: Primitive Components**
- Simple, reusable UI elements
- Connect to context
- No conditional logic

**Layer 3: Composed Variations**
- Specific use cases
- Built from primitives + context
- Clear, intentional design

---

## 💡 Key Concepts

### 1. No Prop Drilling

**Before (Prop Drilling):**
```jsx
function Parent() {
  return <Child submit={handleSubmit} />;
}

function Child({ submit }) {
  return <GrandChild submit={submit} />;
}

function GrandChild({ submit }) {
  return <Button onClick={submit}>Send</Button>;
}
```

**After (Context):**
```jsx
function Parent() {
  return (
    <ComposerProvider onSubmit={handleSubmit}>
      <Child />
    </ComposerProvider>
  );
}

function Child() {
  return <GrandChild />;
}

function GrandChild() {
  const { submit } = useComposer();
  return <Button onClick={submit}>Send</Button>;
}
```

### 2. Composition Over Configuration

**Before (Boolean Props):**
```jsx
<Composer
  isThread={true}
  showMention={true}
  showAttach={false}
  // ...
/>
```

**After (Composition):**
```jsx
<ThreadComposer>
  {/* Mention button is part of the composition */}
</ThreadComposer>
```

### 3. Decoupled State Implementation

**Option 1: Local State**
```jsx
<ComposerProvider onSubmit={handleSubmit}>
  {children}
</ComposerProvider>
```

**Option 2: Custom Hook**
```jsx
<ComposerProvider 
  onSubmit={handleSubmit}
  useStateFn={useReduxComposerState}
>
  {children}
</ComposerProvider>
```

The interface stays the same, only the implementation changes.

---

## 📚 Usage Patterns

### Pattern 1: Simple Channel Message

```jsx
import { ChannelComposer } from './composer';

export function ChatWindow() {
  const handleSendMessage = async (data) => {
    await api.post('/messages', data);
  };

  return (
    <ChannelComposer 
      channelName="general"
      onSendMessage={handleSendMessage}
    />
  );
}
```

### Pattern 2: Thread Reply

```jsx
import { ThreadComposer } from './composer';

export function ThreadView({ threadId, channelName }) {
  const handleReply = async (data) => {
    await api.post(`/threads/${threadId}/replies`, data);
  };

  return (
    <ThreadComposer
      threadId={threadId}
      channelName={channelName}
      onReplyToThread={handleReply}
    />
  );
}
```

### Pattern 3: Edit Message

```jsx
import { EditMessageComposer } from './composer';

export function MessageActions({ message, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <EditMessageComposer
          messageId={message.id}
          currentContent={message.content}
          onSaveEdit={async (data) => {
            await onSave(data);
            setIsEditing(false);
          }}
        />
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      )}
    </>
  );
}
```

### Pattern 4: Custom Composition

```jsx
import {
  ComposerProvider,
  ComposerContainer,
  ComposerInput,
  ComposerFooter,
  ComposerButton,
} from './composer';

export function CustomComposer() {
  const handleSubmit = async (data) => {
    console.log('Custom submit:', data);
  };

  return (
    <ComposerProvider onSubmit={handleSubmit}>
      <ComposerContainer>
        <h3>Custom Composer</h3>
        <ComposerInput placeholder="Your custom placeholder" />
        
        <ComposerFooter>
          <div>Custom left content</div>
          <ComposerButton variant="primary">Custom Action</ComposerButton>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}
```

### Pattern 5: Context-Aware Components

```jsx
import { useComposer, ComposerProvider } from './composer';

function MyCustomButton() {
  const { submit, content, isSubmitting } = useComposer();

  return (
    <button 
      onClick={() => submit()}
      disabled={!content.trim() || isSubmitting}
    >
      {isSubmitting ? 'Sending...' : 'Send'}
    </button>
  );
}

function App() {
  return (
    <ComposerProvider onSubmit={handleSubmit}>
      <div>
        <textarea />
        <MyCustomButton />
      </div>
    </ComposerProvider>
  );
}
```

---

## 🔄 State Management Integration

### Using Redux

```jsx
function useReduxComposerState(initialValue) {
  const dispatch = useDispatch();
  const value = useSelector(state => state.composer);
  
  return [
    value,
    (newValue) => dispatch(updateComposer(newValue))
  ];
}

<ComposerProvider 
  onSubmit={handleSubmit}
  useStateFn={useReduxComposerState}
>
  {children}
</ComposerProvider>
```

### Using Zustand

```jsx
import { useComposerStore } from './store';

function useZustandComposerState(initialValue) {
  const { content, setContent } = useComposerStore();
  return [content, setContent];
}

<ComposerProvider 
  onSubmit={handleSubmit}
  useStateFn={useZustandComposerState}
>
  {children}
</ComposerProvider>
```

### Using MobX

```jsx
function useMobXComposerState(initialValue) {
  const store = useComposerStore();
  return [
    store.content,
    (value) => { store.content = value; }
  ];
}
```

---

## 🧪 Testing

### Testing Custom Components with Context

```jsx
import { ComposerProvider, useComposer } from './composer';
import { render, fireEvent } from '@testing-library/react';

test('Custom button submits message', () => {
  const onSubmit = jest.fn();
  
  function TestButton() {
    const { submit } = useComposer();
    return <button onClick={() => submit()}>Send</button>;
  }

  const { getByText } = render(
    <ComposerProvider onSubmit={onSubmit}>
      <TestButton />
    </ComposerProvider>
  );

  fireEvent.click(getByText('Send'));
  expect(onSubmit).toHaveBeenCalled();
});
```

### Testing Composed Variations

```jsx
test('ChannelComposer renders with correct channel', () => {
  const { getByPlaceholderText } = render(
    <ChannelComposer 
      channelName="general"
      onSendMessage={jest.fn()}
    />
  );

  expect(getByPlaceholderText('Message #general')).toBeInTheDocument();
});
```

---

## 🎯 Best Practices

### ✅ DO

1. **Create specific composed components** for each use case
   ```jsx
   // Good
   <ChannelComposer />
   <ThreadComposer />
   <EditMessageComposer />
   ```

2. **Use composition for UI variations** instead of boolean props
   ```jsx
   // Good: Caller decides structure
   <ComposerProvider onSubmit={...}>
     <ComposerInput />
     <ComposerFooter>
       <ActionButton1 />
       <ActionButton2 />
     </ComposerFooter>
   </ComposerProvider>

   // Avoid: Component decides structure
   <Composer 
     showAction1={true}
     showAction2={false}
     onSubmit={...}
   />
   ```

3. **Store context-related state in the provider**
   ```jsx
   // Good
   const [content, setContent] = useStateFn('');
   const [metadata, setMetadata] = useStateFn({});

   // Avoid: Keeping state outside provider
   const [localState, setLocalState] = useState('');
   ```

4. **Use descriptive component names** that indicate their purpose
   ```jsx
   // Good
   <ChannelComposer />
   <ThreadComposer />

   // Avoid
   <Composer variant="channel" />
   ```

### ❌ DON'T

1. **Don't use conditional rendering inside the provider**
   ```jsx
   // Bad
   <ComposerProvider>
     {isThread ? <ThreadUI /> : <ChannelUI />}
   </ComposerProvider>

   // Good
   {isThread ? <ThreadComposer /> : <ChannelComposer />}
   ```

2. **Don't pass context values as props**
   ```jsx
   // Bad
   const { content } = useComposer();
   <ChildComponent content={content} />

   // Good
   <ChildComponent />
   // Inside ChildComponent:
   const { content } = useComposer();
   ```

3. **Don't add boolean props to ComposerProvider**
   ```jsx
   // Bad
   <ComposerProvider 
     showAttachments={true}
     showEmoji={false}
   />

   // Good: Compose what you want to show
   <ComposerProvider>
     <ComposerAttachments />
   </ComposerProvider>
   ```

---

## 🚦 Scaling Considerations

### Adding New Variations

To add a new composer variation, create a new composed component:

```jsx
export function DraftComposer({ onSaveDraft }) {
  return (
    <ComposerProvider onSubmit={onSaveDraft}>
      <ComposerContainer>
        <div style={{ color: '#ff9500' }}>📝 Draft</div>
        <ComposerInput placeholder="Save draft..." />
        <ComposerAttachments />
        <ComposerFooter>
          <ComposerButton>Discard</ComposerButton>
          <ComposerButton variant="primary">Save Draft</ComposerButton>
        </ComposerFooter>
      </ComposerContainer>
    </ComposerProvider>
  );
}
```

No need to modify the provider or other composers. Scaling is easy!

### Adding New Actions

Action buttons are just components that use `useComposer()`. Add them anywhere:

```jsx
function CustomAction() {
  const { updateMetadata } = useComposer();

  return (
    <button onClick={() => updateMetadata('custom', true)}>
      Custom Action
    </button>
  );
}
```

Then compose them into your composer:

```jsx
<ComposerProvider onSubmit={...}>
  <ComposerInput />
  <ComposerFooter>
    <CustomAction />
  </ComposerFooter>
</ComposerProvider>
```

---

## 📖 References

- [Fernando Rojo - Composition Is All You Need](https://www.youtube.com/watch?v=WakUe-gJNMY)
- [React Context API Documentation](https://react.dev/reference/react/useContext)
- [Provider Pattern](https://www.patterns.dev/react/provider-pattern/)
- [Compound Components Pattern](https://www.patterns.dev/react/compound-pattern/)

---

## 💬 Examples Included

1. **ChannelComposer** - Message to a channel with attachments and emoji
2. **ThreadComposer** - Reply in a thread with mention option
3. **EditMessageComposer** - Edit existing message with different styling
4. **ComposerWithSidePanel** - Composer with stats preview panel
5. **ParentComposerWithNestedReply** - Multiple composers in one view
6. **ComposerWithTypingIndicator** - Composer that detects when user is typing

All examples follow the same patterns and are fully composable.

---

## 🎓 Learning Path

1. **Start here:** Review `ComposerDemo.jsx` to see all patterns in action
2. **Understand the core:** Read `ARCHITECTURE.md` for detailed explanation
3. **Learn variations:** Study `ComposerExamples.jsx` to see how compositions are built
4. **Advanced patterns:** Explore `AdvancedPatterns.jsx` for complex use cases
5. **Build your own:** Create custom composers following the same patterns

---

## 🤝 Contributing

When adding new features:

1. Keep primitives simple and focused
2. Create composed variations for new use cases
3. Don't add boolean props to the provider
4. Document your patterns with comments
5. Maintain the "composition first" philosophy

---

## 📝 Summary

This composition pattern provides:

✅ **No prop drilling** - Use context hooks anywhere
✅ **No boolean hell** - Compose what you need
✅ **Flexible state** - Works with any state management
✅ **Easy to scale** - Add variations without modifying core
✅ **AI-friendly** - Clear patterns, easy to understand
✅ **Maintainable** - Each piece has one responsibility

Start using it today and experience the power of composition!
