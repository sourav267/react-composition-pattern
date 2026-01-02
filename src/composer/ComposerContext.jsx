import React, { useRef, useEffect } from 'react';
import { ComposerContext } from './ComposerContextValue';
import { createComposerStore } from './composerStore';

/**
 * ComposerProvider - The core composition building block
 *
 * This provider returns a Zustand store instance via context.
 * Consumers should use the `useComposer` hook to access state.
 */
export function ComposerProvider({
  children,
  onSubmit,
  initialValue = '',
}) {
  // Create store once per component instance
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createComposerStore(initialValue);
  }
  const store = storeRef.current;

  // Sync the submit action with the latest onSubmit prop
  useEffect(() => {
    const wrappedSubmit = async (additionalData = {}) => {
      try {
        store.setState({ isSubmitting: true });

        // Get snapshot for submission
        const { content, attachments, metadata, reset } = store.getState();

        await onSubmit({
          content,
          attachments,
          metadata,
          ...additionalData,
        });

        // Reset after successful submission
        reset();
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        store.setState({ isSubmitting: false });
      }
    };

    store.setState({ submit: wrappedSubmit });
  }, [onSubmit, store]); // Re-create wrappedSubmit if onSubmit changes

  // Debug: Sync initialValue if it changes? 
  // Usually initialValue is only for initialization, but some patterns might want updates.
  // The original didn't sync initialValue updates to 'content' state after mount (it was passed to useState(initialValue)).
  // So we don't need to sync it here either.

  return (
    <ComposerContext.Provider value={store}>
      {children}
    </ComposerContext.Provider>
  );
}
