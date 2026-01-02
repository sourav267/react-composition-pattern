import React, { createContext } from 'react';

/**
 * ComposerContext - The context object
 * 
 * Separated into its own file to enable Fast Refresh in development.
 * Fast Refresh requires that component-exporting files don't also export
 * non-component values (like context objects).
 * 
 * This context decouples the state management from the UI layer,
 * allowing for different implementations (ephemeral useState, global state, etc.)
 * without changing the interface contract for child components.
 */
export const ComposerContext = createContext(null);

/**
 * useComposer - Hook to access composer context
 * 
 * This hook is used by any descendant component in the tree,
 * demonstrating that state access is not limited to immediate children.
 */
export function useComposer() {
  const context = React.useContext(ComposerContext);
  if (!context) {
    throw new Error('useComposer must be used within ComposerProvider');
  }
  return context;
}
