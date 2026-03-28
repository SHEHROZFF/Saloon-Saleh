import { Link } from 'react-router-dom';
import { LogOut, Home, User } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import Button from '../components/ui/Button';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b bg-white shadow-sm">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="text-xl font-bold text-primary-600">
                            Needy Assistance
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                <Home className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                <User className="h-4 w-4" />
                                <span>Profile</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{user?.name}</span>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container py-8">{children}</main>
        </div>
    );
};

export default MainLayout;
