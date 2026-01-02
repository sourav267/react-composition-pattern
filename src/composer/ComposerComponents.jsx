import { useComposer } from './ComposerContextValue';

/**
 * ComposerInput - Internal component that demonstrates context consumption
 * 
 * This component doesn't need any props related to state or handlers.
 * It pulls everything from the context, keeping the component's interface clean.
 * 
 * This shows how composition allows child components to be "smart" about
 * accessing what they need without prop drilling.
 */
export function ComposerInput({ placeholder = 'Type a message...', className = '' }) {
  const { content, updateContent, isSubmitting } = useComposer();

  return (
    <textarea
      value={content}
      onChange={(e) => updateContent(e.target.value)}
      placeholder={placeholder}
      disabled={isSubmitting}
      className={`composer-input ${className}`}
      style={{
        width: '100%',
        padding: '12px',
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '100px',
      }}
    />
  );
}

/**
 * ComposerFooter - Container for footer actions
 * 
 * This is a composition point where child elements are passed as JSX.
 * Instead of conditionally rendering actions based on props,
 * the caller composes what actions should appear.
 */
export function ComposerFooter({ children, className = '' }) {
  return (
    <div
      className={`composer-footer ${className}`}
      style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #eee',
      }}
    >
      {children}
    </div>
  );
}

/**
 * ComposerActions - A sub-component of ComposerFooter for action buttons
 * 
 * This shows how composition allows for flexible, nested structures.
 * Actions can be composed independently of the rest of the footer.
 */
export function ComposerActions({ children, className = '' }) {
  return (
    <div
      className={`composer-actions ${className}`}
      style={{
        display: 'flex',
        gap: '8px',
        marginRight: 'auto',
      }}
    >
      {children}
    </div>
  );
}

/**
 * ComposerButton - Base button component for composer actions
 * 
 * This is intentionally simple - actions are composed as JSX,
 * so they maintain full control over their appearance and behavior.
 */
export function ComposerButton({
  onClick,
  disabled = false,
  children,
  variant = 'secondary',
  ...props
}) {
  const { isSubmitting } = useComposer();
  
  const baseStyle = {
    padding: '8px 12px',
    fontSize: '14px',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled || isSubmitting ? 'not-allowed' : 'pointer',
    opacity: disabled || isSubmitting ? 0.6 : 1,
    fontWeight: '500',
    transition: 'all 0.2s',
  };

  const variantStyles = {
    primary: {
      ...baseStyle,
      backgroundColor: '#007a5e',
      color: 'white',
    },
    secondary: {
      ...baseStyle,
      backgroundColor: '#f5f5f5',
      color: '#333',
      border: '1px solid #ddd',
    },
    ghost: {
      ...baseStyle,
      backgroundColor: 'transparent',
      color: '#666',
      border: '1px solid transparent',
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isSubmitting}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * ComposerAttachments - Display area for attachments
 * 
 * Demonstrates how composition allows for flexible display of data
 * managed by the provider, without conditional logic in parent components.
 */
export function ComposerAttachments({ className = '' }) {
  const { attachments, removeAttachment } = useComposer();

  if (attachments.length === 0) return null;

  return (
    <div
      className={`composer-attachments ${className}`}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '8px 0',
      }}
    >
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          <span>📎 {attachment.name}</span>
          <button
            onClick={() => removeAttachment(attachment.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * ComposerContainer - Wrapper component
 * 
 * Provides basic layout structure for the composer components.
 */
export function ComposerContainer({ children, className = '' }) {
  return (
    <div
      className={`composer-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      {children}
    </div>
  );
}
