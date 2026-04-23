import toast, { Toaster as HotToaster } from 'react-hot-toast';

// ─── Re-export the Toaster component, pre-styled for the salon theme ───
export const Toaster = () => (
    <HotToaster
        position="top-right"
        toastOptions={{
            duration: 4000,
            style: {
                background: '#1a1a1a',
                color: '#f5f0e8',
                border: '1px solid rgba(200,170,110,0.2)',
                padding: '14px 18px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            },
            success: {
                iconTheme: { primary: '#c8aa6e', secondary: '#1a1a1a' },
            },
            error: {
                duration: 5000,
                iconTheme: { primary: '#ef4444', secondary: '#1a1a1a' },
            },
        }}
    />
);

// ─── Helper to extract a human-readable message from any API error shape ───
export const extractErrorMessage = (error: unknown): string => {
    if (!error) return 'An unexpected error occurred.';

    // Shape 1: { message: "..." } (from AppError via apiClient interceptor)
    if (typeof error === 'object' && 'message' in error) {
        return (error as any).message;
    }

    // Shape 2: plain string
    if (typeof error === 'string') return error;

    return 'Something went wrong. Please try again.';
};

export { toast };
