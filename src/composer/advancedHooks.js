/**
 * Advanced Hooks for Composer Pattern
 * ===================================
 * 
 * Separated into its own file to enable Fast Refresh in development.
 * Fast Refresh requires that component-exporting files don't also export
 * non-component values (like hooks and functions).
 */

import React, { useState } from 'react';
import { useComposer } from './ComposerContext';

/**
 * Custom hook that composes behaviors
 * Shows how to extract complex composer logic into reusable hooks.
 */
export function useComposerWithTypingIndicator() {
  const composer = useComposer();
  const [isTyping, setIsTyping] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (composer.content && isTyping) {
        // Notify others that user is typing
        console.log('User is typing...');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [composer.content, isTyping]);

  return {
    ...composer,
    isTyping,
    setIsTyping,
  };
}

/**
 * Utility function: Redux composer state hook
 * In a real app, this would use Redux selectors and dispatch
 */
// eslint-disable-next-line no-unused-vars
export function useReduxComposerState(_key) {
  const [value, setValue] = useState('');
  return [value, setValue];
}
