import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from '@store/store';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <CartProvider>
                        <PersistGate loading={null} persistor={persistor}>
                            <App />
                        </PersistGate>
                    </CartProvider>
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);
