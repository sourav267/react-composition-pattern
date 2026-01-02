/**
 * Composition Pattern Implementation Index
 * ========================================
 * 
 * This is the main entry point for the composition pattern implementation.
 * It re-exports all necessary components and utilities.
 */

// Core Context & Provider
export { ComposerProvider } from './ComposerContext';
export { ComposerContext, useComposer } from './ComposerContextValue';

// Primitive Components
export {
  ComposerInput,
  ComposerFooter,
  ComposerActions,
  ComposerButton,
  ComposerAttachments,
  ComposerContainer,
} from './ComposerComponents';

// Composition Examples
export {
  ChannelComposer,
  ThreadComposer,
  EditMessageComposer,
  ChannelAttachButton,
  ChannelEmojiButton,
  ThreadMentionButton,
  SubmitButton,
  CancelButton,
  EditCancelButton,
  SaveEditButton,
} from './ComposerExamples';

// Advanced Pattern Components
export {
  ReduxComposerExample,
  ComposerWithRenderProps,
  ComposerWithSidePanel,
  ParentComposerWithNestedReply,
  ComposerWithTypingIndicator,
} from './AdvancedPatterns';

// Advanced Hooks
export {
  useComposerWithTypingIndicator,
  useReduxComposerState,
} from './advancedHooks';

// Advanced Utilities (HOCs, etc.)
export {
  withComposerTracking,
} from './advancedUtils';

// Testing Utilities
export {
  createMockComposerValue,
  createDefaultMockComposerValue,
} from './testingUtils';
