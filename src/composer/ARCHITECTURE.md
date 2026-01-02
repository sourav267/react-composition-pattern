/**
 * COMPOSITION PATTERN ARCHITECTURE
 * ================================
 * 
 * This implementation follows Fernando Rojo's "Composition Is All You Need" principles:
 * https://www.youtube.com/watch?v=WakUe-gJNMY
 * 
 * Problem Solved: "Boolean Prop Hell"
 * ===================================
 * Before composition, a flexible composer might look like:
 * 
 * <Composer
 *   isThread={false}
 *   isEdit={false}
 *   showAttachments={true}
 *   showEmoji={true}
 *   showMention={false}
 *   threadId={null}
 *   messageId={null}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 *   // ... 20+ more props
 * />
 * 
 * This approach has several problems:
 * - Hard to understand which prop combinations are valid
 * - Adding new variations requires new props
 * - Hard to maintain and test
 * - Violates Single Responsibility Principle
 * 
 * 
 * Solution: Provider Pattern + Composition
 * =========================================
 * 
 * 1. PROVIDER PATTERN
 *    The ComposerProvider centralizes all state management and exposes it via Context.
 *    This allows ANY component in the tree to access state without prop drilling.
 * 
 * 2. COMPOSITION THROUGH JSX
 *    Instead of conditional rendering inside the component based on props,
 *    the CALLER decides what UI elements to compose.
 * 
 * 3. DECOUPLED IMPLEMENTATION
 *    The provider accepts a custom useStateFn, allowing different state management
 *    strategies (useState, Redux, Zustand, MobX, etc.) without changing the interface.
 * 
 * 
 * ARCHITECTURE LAYERS
 * ===================
 * 
 * Layer 1: ComposerContext + ComposerProvider
 * ─────────────────────────────────────────
 * - Manages: content, attachments, metadata, isSubmitting
 * - Provides actions: updateContent, addAttachment, removeAttachment, submit, reset
 * - Exposes: useComposer() hook for descendants to access state
 * 
 * Layer 2: Primitive Components
 * ──────────────────────────────
 * - ComposerInput: Textarea that updates context
 * - ComposerFooter: Container for actions
 * - ComposerActions: Sub-container for grouped actions
 * - ComposerButton: Reusable button with variants
 * - ComposerAttachments: Displays attachments from context
 * - ComposerContainer: Base layout wrapper
 * 
 * These components are "dumb" in the sense that they don't make decisions about
 * when to render - they just render their input. Intelligence comes from composition.
 * 
 * Layer 3: Composition Patterns
 * ─────────────────────────────
 * - ChannelComposer: Composed for channel messaging (shows attachments, emoji)
 * - ThreadComposer: Composed for thread replies (simplified UI, shows mention)
 * - EditMessageComposer: Composed for editing messages (different styling, save action)
 * 
 * Layer 4: Action Buttons (Context Consumers)
 * ──────────────────────────────────────────
 * - ChannelAttachButton, ChannelEmojiButton, ThreadMentionButton, etc.
 * - These buttons access context directly via useComposer()
 * - They can be positioned anywhere in the tree, no prop drilling needed
 * 
 * 
 * DATA FLOW
 * =========
 * 
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ComposerProvider (CONTEXT PROVIDER)                         │
 * │                                                              │
 * │  State: content, attachments, metadata, isSubmitting        │
 * │  Actions: updateContent, addAttachment, submit, reset       │
 * │                                                              │
 * └────────────────────┬────────────────────────────────────────┘
 *                      │
 *           (Context.Provider wraps children)
 *                      │
 *        ┌─────────────┴──────────────┐
 *        │                            │
 *    ┌───▼─────────────┐  ┌──────────▼────────┐
 *    │ ComposerInput   │  │ ComposerFooter    │
 *    │                 │  │                   │
 *    │ useComposer()   │  │ ┌───────────────┐ │
 *    │ → content       │  │ │ ComposerActions
 *    │ → updateContent │  │ │               │ │
 *    │                 │  │ │ ┌────────────┐│ │
 *    │                 │  │ │ │ ActionBtn  ││ │
 *    │                 │  │ │ │ useComposer││ │
 *    │                 │  │ │ │ → submit   ││ │
 *    │                 │  │ │ └────────────┘│ │
 *    │                 │  │ └───────────────┘ │
 *    └─────────────────┘  └──────────────────┘
 * 
 * All components (even deeply nested ActionButtons) can call useComposer()
 * to access state and actions. NO PROP DRILLING.
 * 
 * 
 * EXTENSIBILITY
 * =============
 * 
 * The provider is designed to support different state management implementations:
 * 
 * // Using local state (default)
 * <ComposerProvider onSubmit={handleSubmit}>
 *   {children}
 * </ComposerProvider>
 * 
 * // Using custom hook (e.g., useGlobalChannel from a state management library)
 * const [content, setContent] = useGlobalChannel('composer-content');
 * <ComposerProvider 
 *   onSubmit={handleSubmit}
 *   useStateFn={() => [content, setContent]}
 * >
 *   {children}
 * </ComposerProvider>
 * 
 * This design allows the interface contract (what child components see via context)
 * to remain stable while the implementation (where state lives) can change.
 * 
 * 
 * COMPARISON: COMPOSITION VS TRADITIONAL APPROACHES
 * ==================================================
 * 
 * Traditional Approach (Props + Conditional Rendering):
 * ─────────────────────────────────────────────────────
 * <Composer variant="channel" onSubmit={...} />
 * <Composer variant="thread" onSubmit={...} />
 * <Composer variant="edit" onSubmit={...} />
 * 
 * Problems:
 * - Component becomes a "kitchen sink" with many variants
 * - Hard to understand which props are relevant for each variant
 * - New variants require modifying the original component
 * - Conditional logic inside component increases complexity
 * 
 * Composition Approach (This Implementation):
 * ────────────────────────────────────────────
 * // Caller decides what to compose
 * <ChannelComposer onSendMessage={...} />
 * <ThreadComposer onReplyToThread={...} />
 * <EditMessageComposer onSaveEdit={...} />
 * 
 * Benefits:
 * - Each composer is tailored to its use case
 * - Clear intent from the component name
 * - Easy to add new composers without changing existing code
 * - Easier to test (simpler components with clear responsibilities)
 * - UI structure is explicit in the JSX, not hidden in conditional logic
 * 
 * 
 * SCALING CONSIDERATIONS
 * ======================
 * 
 * This pattern scales because:
 * 
 * 1. New Variations: Just create a new wrapper component (ChannelComposer, ThreadComposer)
 *    without touching the provider or primitive components.
 * 
 * 2. New Actions: Action buttons use useComposer() and compose themselves into the JSX.
 *    No need to add more properties to the provider.
 * 
 * 3. State Management: Switch state management libraries by changing useStateFn,
 *    no changes needed to child components.
 * 
 * 4. Accessibility & Styling: Each composed variant can have different styling,
 *    without the complexity of style variants in a single component.
 * 
 * 
 * REAL-WORLD APPLICATIONS
 * =======================
 * 
 * This pattern works great for:
 * - UI component libraries with multiple variations
 * - Form builders and composers (like Slack, Discord, Figma comments)
 * - Multi-step wizards with different UIs per step
 * - Conditional features based on user permissions or roles
 * - A/B testing different UI layouts without component bloat
 * 
 * 
 * KEY TAKEAWAYS
 * =============
 * 
 * ✅ Avoid boolean prop hell by using composition
 * ✅ Use Provider Pattern to lift state high and avoid prop drilling
 * ✅ Let the caller decide the structure through JSX composition
 * ✅ Make implementations swappable (useState, Redux, etc.)
 * ✅ Write small, focused components that do one thing well
 * ✅ Use context hooks (useComposer) for accessing shared state anywhere in the tree
 * ✅ Test variations separately instead of testing one mega-component
 */

export const ARCHITECTURE_DOCS = {};
