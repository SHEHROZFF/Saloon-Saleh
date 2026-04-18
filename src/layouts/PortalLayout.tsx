import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CalendarRange, ShoppingBag,
    Users, Scissors, Package, Tag, ClipboardList,
    LogOut, Menu, X, UserCircle, ChevronRight, TrendingUp, Settings
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { logout } from '@store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';

interface PortalLayoutProps {
    children: React.ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const user = useAppSelector(state => state.auth.user);

    // Defaulting to admin for safety, but real routing limits access
    const isStaff = user?.userType === 'staff';
    const isAdmin = user?.userType === 'admin';

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const adminNavItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Bookings', path: '/admin/bookings', icon: CalendarRange },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Reports', path: '/admin/reports', icon: TrendingUp },
        { name: 'Expert Blogs', path: '/admin/blogs', icon: ClipboardList },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Services', path: '/admin/services', icon: Scissors },
        { name: 'Staff Members', path: '/admin/staff', icon: Users },
        { name: 'Coupons', path: '/admin/coupons', icon: Tag },
        { name: 'Waitlist', path: '/admin/waitlist', icon: ClipboardList },
        { name: 'Customers', path: '/admin/users', icon: UserCircle },
        { name: 'Site Content', path: '/admin/settings', icon: Settings },
    ];

    const staffNavItems = [
        { name: 'My Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
        { name: 'My Schedule', path: '/staff/bookings', icon: CalendarRange },
        { name: 'My Profile', path: '/staff/portfolio', icon: UserCircle },
        { name: 'My Blogs', path: '/staff/blogs', icon: ClipboardList },
    ];

    const navItems = isStaff ? staffNavItems : adminNavItems;

    // Helper to extract page title from pathname
    const getCurrentPageTitle = () => {
        const path = location.pathname;
        if (path === '/admin/dashboard' || path === '/staff/dashboard') return 'Dashboard';
        const item = navItems.find(nav => path.startsWith(nav.path) && nav.path !== '/admin/dashboard' && nav.path !== '/staff/dashboard');
        return item ? item.name : 'Portal';
    };

    return (
        <div className="min-h-screen bg-salon-surface flex overflow-hidden font-sans text-salon-primary">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 flex-col bg-salon-base border-r border-salon-golden/10 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.2)] dark:shadow-none">
                <div className="h-24 flex items-center px-8 border-b border-salon-golden/10 bg-salon-surface/30">
                    <img src="/Main_logo_wo_BG.png" alt="Salon Saleh" className="h-10 w-10 object-contain mr-3" />
                    <div className="flex flex-col">
                        <span className="font-serif text-lg tracking-wider text-salon-primary leading-tight">SALON SALEH</span>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-salon-golden-muted">{isStaff ? 'Staff Portal' : 'Admin Portal'}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 sleek-scrollbar">
                    <nav className="space-y-1.5 flex flex-col">
                        <span className="px-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-salon-golden-muted/60 mb-2">Menu</span>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            // Exact match for dashboard, startswith for others
                            const isActive = item.path.includes('dashboard')
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path);

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={`
                                        group flex items-center px-4 py-3 text-sm rounded-md transition-all duration-300 relative overflow-hidden
                                        ${isActive
                                            ? 'text-salon-golden bg-salon-golden/5 font-medium'
                                            : 'text-salon-muted hover:text-salon-primary hover:bg-salon-surface'
                                        }
                                    `}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-salon-golden"
                                        />
                                    )}
                                    <Icon className={`mr-4 h-5 w-5 transition-colors ${isActive ? 'text-salon-golden' : 'text-salon-muted group-hover:text-salon-golden-muted'}`} strokeWidth={1.5} />
                                    <span className="tracking-wide z-10 relative">{item.name}</span>
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="px-6 py-6 border-t border-salon-golden/10 bg-salon-surface/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-salon-golden/20 border border-salon-golden/30 flex items-center justify-center flex-shrink-0">
                        <span className="font-serif font-bold text-salon-golden">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium truncate text-salon-primary">{user?.name || 'User'}</span>
                        <span className="text-[10px] text-salon-muted truncate capitalize">{user?.userType || 'Admin'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-salon-muted hover:text-red-500 transition-colors p-2"
                        title="Sign Out"
                    >
                        <LogOut className="h-5 w-5" strokeWidth={1.5} />
                    </button>
                </div>
            </aside>

            {/* Mobile Header & Sidebar overlay */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-salon-base z-30 border-b border-salon-golden/10 flex justify-between items-center px-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <img src="/Main_logo_wo_BG.png" alt="Salon Saleh" className="h-7 w-7 object-contain" />
                    <span className="font-serif text-sm tracking-wider text-salon-primary">SALON SALEH</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-salon-primary"
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-salon-base z-50 flex flex-col lg:hidden border-r border-salon-golden/20"
                    >
                        <div className="h-20 flex items-center px-6 border-b border-salon-golden/10">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-salon-golden-muted">Navigation</span>
                        </div>
                        <div className="flex-1 overflow-y-auto py-6 px-4">
                            <nav className="space-y-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = item.path.includes('dashboard')
                                        ? location.pathname === item.path
                                        : location.pathname.startsWith(item.path);

                                    return (
                                        <NavLink
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`
                                                flex items-center px-4 py-3.5 text-sm rounded-md transition-colors
                                                ${isActive
                                                    ? 'text-salon-golden bg-salon-golden/10 font-medium border-l-2 border-salon-golden'
                                                    : 'text-salon-muted border-l-2 border-transparent hover:text-salon-primary hover:bg-salon-surface'
                                                }
                                            `}
                                        >
                                            <Icon className={`mr-4 h-5 w-5 ${isActive ? 'text-salon-golden' : ''}`} strokeWidth={1.5} />
                                            <span className="tracking-wide">{item.name}</span>
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="p-4 border-t border-salon-golden/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center text-sm px-4 py-3 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                            >
                                <LogOut className="mr-4 h-5 w-5" strokeWidth={1.5} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen pt-16 lg:pt-0 relative overflow-hidden bg-salon-surface">
                {/* Top Navbar */}
                <header className="h-24 hidden lg:flex items-center justify-between px-10 bg-salon-base z-10 border-b border-salon-golden/5">
                    <div>
                        <h1 className="text-2xl font-serif text-salon-primary font-medium tracking-wide">
                            {getCurrentPageTitle()}
                        </h1>
                        <div className="flex items-center text-xs text-salon-muted tracking-widest uppercase mt-1.5">
                            <span>{isAdmin ? 'Admin' : 'Staff'}</span>
                            <ChevronRight className="h-3 w-3 mx-2 text-salon-golden-muted" />
                            <span className="text-salon-golden">{getCurrentPageTitle()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full border border-salon-golden/20 flex items-center justify-center text-salon-muted hover:text-salon-golden hover:border-salon-golden transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>

                        <div className="text-right">
                            <p className="text-sm font-medium text-salon-primary">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</p>
                            <p className="text-[10px] uppercase tracking-widest text-salon-golden-muted mt-0.5">Time to create art</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 sleek-scrollbar relative">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PortalLayout;
