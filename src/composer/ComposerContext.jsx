import React, { useState, useCallback } from 'react';
import { ComposerContext } from './ComposerContextValue';

/**
 * ComposerProvider - The core composition building block
 * 
 * This provider manages:
 * - Text content state
 * - Attachments
 * - Custom metadata (thread context, editing mode, etc.)
 * - Actions and handlers
 * 
 * All lifted to the highest level to avoid prop drilling throughout the tree.
 */
export function ComposerProvider({
  children,
  onSubmit,
  initialValue = '',
  useStateFn = useState, // Allow for custom state hooks (global state, etc.)
}) {
  // State is lifted here - child components access it through context
  const [content, setContent] = useStateFn(initialValue);
  const [attachments, setAttachments] = useStateFn([]);
  const [metadata, setMetadata] = useStateFn({});
  const [isSubmitting, setIsSubmitting] = useStateFn(false);

  // Actions - provided to all descendants without prop drilling
  const updateContent = useCallback((value) => {
    setContent(value);
  }, [setContent]);

  const addAttachment = useCallback((attachment) => {
    setAttachments((prev) => [...prev, attachment]);
  }, [setAttachments]);

  const removeAttachment = useCallback((attachmentId) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }, [setAttachments]);

  const updateMetadata = useCallback((key, value) => {
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, [setMetadata]);

  const submit = useCallback(
    async (additionalData = {}) => {
      try {
        setIsSubmitting(true);
        await onSubmit({
          content,
          attachments,
          metadata,
          ...additionalData,
        });
        // Reset after successful submission
        setContent('');
        setAttachments([]);
        setMetadata({});
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [content, attachments, metadata, onSubmit, setContent, setAttachments, setMetadata, setIsSubmitting]
  );

  const reset = useCallback(() => {
    setContent('');
    setAttachments([]);
    setMetadata({});
  }, [setContent, setAttachments, setMetadata]);

  // Context value - this is the interface contract
  const value = {
    // State
    content,
    attachments,
    metadata,
    isSubmitting,
    
    // Actions
    updateContent,
    addAttachment,
    removeAttachment,
    updateMetadata,
    submit,
    reset,
  };

  return (
    <ComposerContext.Provider value={value}>
      {children}
    </ComposerContext.Provider>
  );
}
