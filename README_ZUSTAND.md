# State Management Refactor: Context vs Zustand

This document outlines the architectural shift from a pure React Context + `useState` approach to a **Zustand**-based implementation for the `react-composition-pattern` project.

## 1. The Core Difference

### Before (Pure React Context)
In the original implementation, the state and the business logic lived inside the React Component lifecycle.

*   **State Storage**: `useState` hooks inside `ComposerProvider`.
*   **Propagation**: The Context Provider passed down a "value" object containing current state snapshots (`content`, `attachments`) and action functions (`updateContent`).
*   **Re-rendering**: Every time a state changed (`setContent`), the `ComposerProvider` re-rendered, creating a *new* context value object. This caused **every component** consuming `useComposer()` to re-render, regardless of whether they used that specific piece of state.

### After (Zustand + Context Injection)
We now use **Zustand** (specifically `vanilla` store) to hold the state, while React Context is used only to *inject* the store instance into the tree.

*   **State Storage**: A persistent, observable object created via `createStore`.
*   **Propagation**: The Context Provider passes down the **Store Instance** (a constant reference), not the state itself.
*   **Re-rendering**: Components subscribe to state changes using specific *selectors*. A component only re-renders if the *specific slice* of state it listens to changes.

---

## 2. Architectural Comparison

### Previous Implementation (`ComposerContext.jsx`)
```jsx
// ❌ Business logic mixed with UI
export function ComposerProvider({ children }) {
  const [content, setContent] = useState('');
  
  // ❌ Re-created on every render (unless carefully memoized)
  const value = { content, setContent };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

### New Implementation (`composerStore.js` + `ComposerContext.jsx`)
```javascript
// ✅ Business logic isolated (Pure JS)
export const createComposerStore = () => createStore((set) => ({
  content: '',
  updateContent: (c) => set({ content: c })
}));
```

```jsx
// ✅ Provider only handles initialization
export function ComposerProvider({ children }) {
  // Store created once, reference never decreases
  const storeRef = useRef(createComposerStore());
  
  return <Context.Provider value={storeRef.current}>{children}</Context.Provider>;
}
```

---

## 3. Why This Matters

| Feature | Context + State | Zustand + Context |
| :--- | :--- | :--- |
| **Performance** | Low. All consumers render on any update. | **High**. Selectors ensure granular re-renders. |
| **Scalability** | Hard. `Provider` grows massive. | **Easy**. Store logic is separated from View. |
| **Testing** | Hard. Requires rendering React Tree. | **Easy**. Test `composerStore` directly in Node/Jest. |
| **Coupling** | Logic coupled to React lifecycle. | Logic is framework-agnostic (mostly). |

## 4. The "Composition" Win

Crucially, **we did not change the Consumer API**.

Because of how we abstracted the logic hook:

```javascript
// src/composer/ComposerContextValue.js

// BEFORE
export function useComposer() {
  return useContext(ComposerContext);
}

// AFTER
export function useComposer(selector) {
  const store = useContext(ComposerContext);
  return useStore(store, selector); 
}
```

The rest of the application (ComposerDemo, Buttons, Inputs) **did not need to change a single line of code**. This proves the power of the Composition Pattern: the implementation details (State Manager) were successfully decoupled from the Component Interface can.
