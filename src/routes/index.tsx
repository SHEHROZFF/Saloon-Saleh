import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ProfilePage from '@pages/dashboard/ProfilePage';
import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';
import LandingPage from '@pages/LandingPage';
import ShopPage from '@pages/ShopPage';
import BookingPage from '@pages/BookingPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <AuthLayout>
                            <LoginPage />
                        </AuthLayout>
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <AuthLayout>
                            <RegisterPage />
                        </AuthLayout>
                    </PublicRoute>
                }
            />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <DashboardPage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <MainLayout>
                            <ProfilePage />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
