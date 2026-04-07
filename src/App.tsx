import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from './components/ui/Toast';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { useEffect } from 'react';
import { apiClient } from './services/api/apiClient';
import { setCredentials } from './store/slices/authSlice';

function App() {
    const dispatch = useAppDispatch();
    const { token, user, refreshToken } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (token) {
            apiClient.setToken(token);
        } else {
            apiClient.clearToken();
        }
    }, [token]);

    useEffect(() => {
        const handleTokenRefresh = (e: any) => {
            const { token: newToken, refreshToken: newRefreshToken } = e.detail;
            if (user) {
                dispatch(setCredentials({ 
                    user, 
                    token: newToken, 
                    refreshToken: newRefreshToken || refreshToken 
                }));
            }
        };
        window.addEventListener('token_refreshed', handleTokenRefresh);
        return () => window.removeEventListener('token_refreshed', handleTokenRefresh);
    }, [dispatch, user, refreshToken]);

    return (
        <BrowserRouter>
            <AppRoutes />
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
