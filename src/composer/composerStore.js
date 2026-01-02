
import { createStore } from 'zustand/vanilla'

export const createComposerStore = (initialValue = '') => {
    return createStore((set) => ({
        // State
        content: initialValue,
        attachments: [],
        metadata: {},
        isSubmitting: false,

        // Actions
        updateContent: (value) => set({ content: value }),

        addAttachment: (attachment) => set((state) => ({
            attachments: [...state.attachments, attachment]
        })),

        removeAttachment: (attachmentId) => set((state) => ({
            attachments: state.attachments.filter((a) => a.id !== attachmentId)
        })),

        updateMetadata: (key, value) => set((state) => ({
            metadata: {
                ...state.metadata,
                [key]: value,
            }
        })),

        reset: () => set({
            content: '',
            attachments: [],
            metadata: {}
        }),

        // Submit placeholder - will be overridden by Provider or injected
        submit: async () => {
            console.warn('Submit function not initialized')
        }
    }))
}
