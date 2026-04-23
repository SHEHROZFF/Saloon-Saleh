import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import LoginPage from '@pages/auth/LoginPage';
import AuthLayout from '@layouts/AuthLayout';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@pages/auth/ResetPasswordPage';
import PortalLayout from '@layouts/PortalLayout';

// Public Pages
import LandingPage from '@pages/LandingPage';
import ShopPage from '@pages/ShopPage';
import BookingPage from '@pages/BookingPage';
import CartPage from '@pages/CartPage';
import CheckoutPage from '@pages/CheckoutPage';
import OrderSuccessPage from '@pages/OrderSuccessPage';
import ExpertProfilePage from '@pages/ExpertProfilePage';
import BlogDetailPage from '@pages/BlogDetailPage';
import BlogListPage from '@pages/BlogListPage';

// Admin Portal Pages
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminBookings from '@pages/admin/AdminBookings';
import AdminOrders from '@pages/admin/AdminOrders';
import AdminProducts from '@pages/admin/AdminProducts';
import AdminServices from '@pages/admin/AdminServices';
import AdminStaff from '@pages/admin/AdminStaff';
import AdminCoupons from '@pages/admin/AdminCoupons';
import AdminWaitlist from '@pages/admin/AdminWaitlist';
import AdminReports from '@pages/admin/AdminReports';
import AdminStaffDetail from '@pages/admin/AdminStaffDetail';
import AdminSiteSettings from '@pages/admin/AdminSiteSettings';
import AdminBlogs from '@pages/admin/AdminBlogs';

// Staff Portal Pages
import StaffDashboard from '@pages/staff/StaffDashboard';
import StaffBookings from '@pages/staff/StaffBookings';
import StaffProfile from '@pages/staff/StaffProfile';
import StaffBlogs from '@pages/staff/StaffBlogs';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user || !allowedRoles.includes(user.userType)) {
        // User logged in but doesn't have permission for this route
        // Send them to their appropriate dashboard, or home if customer
        if (user?.userType === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user?.userType === 'staff') return <Navigate to="/staff/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

// Public Route Guard (prevents logged-in admins from seeing login page)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    
    if (isAuthenticated && user) {
        if (user.userType === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.userType === 'staff') return <Navigate to="/staff/dashboard" replace />;
    }
    
    return <>{children}</>;
};


const AppRoutes = () => {
    return (
        <Routes>
            {/* ─── PUBLIC SHOP / LANDING ─── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/experts/:id" element={<ExpertProfilePage />} />

            {/* ─── AUTHENTICATION ─── */}
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
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <AuthLayout>
                            <ForgotPasswordPage />
                        </AuthLayout>
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password"
                element={
                    <PublicRoute>
                        <AuthLayout>
                            <ResetPasswordPage />
                        </AuthLayout>
                    </PublicRoute>
                }
            />

            {/* ─── ADMIN PORTAL (Only 'admin' can access) ─── */}
            <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <PortalLayout>
                        <Routes>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="bookings" element={<AdminBookings />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="services" element={<AdminServices />} />
                            <Route path="staff" element={<AdminStaff />} />
                            <Route path="coupons" element={<AdminCoupons />} />
                            <Route path="waitlist" element={<AdminWaitlist />} />
                            <Route path="reports" element={<AdminReports />} />
                            <Route path="reports/staff/:id" element={<AdminStaffDetail />} />
                            <Route path="blogs" element={<AdminBlogs />} />
                            <Route path="settings" element={<AdminSiteSettings />} />
                            <Route path="users" element={<div className="p-8 font-serif text-salon-primary">Users Management (Coming Soon)</div>} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </PortalLayout>
                </ProtectedRoute>
            } />

            {/* ─── STAFF PORTAL (Only 'staff' can access) ─── */}
            <Route path="/staff/*" element={
                <ProtectedRoute allowedRoles={['staff']}>
                    <PortalLayout>
                        <Routes>
                            <Route path="dashboard" element={<StaffDashboard />} />
                            <Route path="bookings" element={<StaffBookings />} />
                             <Route path="portfolio" element={<StaffProfile />} />
                            <Route path="blogs" element={<StaffBlogs />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </PortalLayout>
                </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
