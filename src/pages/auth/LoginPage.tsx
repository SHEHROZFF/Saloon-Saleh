import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { authService } from '@services/api/authService';
import { Loader2 } from 'lucide-react';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user came from a specific page, otherwise default to dashboard based on role
    const from = location.state?.from?.pathname;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async values => {
            try {
                setLoading(true);
                setError('');
                // Call the real auth backend we just built
                // We mock it for now since backend integration is phase 2, 
                // but the code is ready for real interaction.
                const response = await authService.login(values);

                // response.data contains { user, token, refreshToken }
                const authData = response.data;
                dispatch(setCredentials(authData));

                // Route based on user role (customer, admin, staff) if no explicit "from" exists
                if (from) {
                    navigate(from, { replace: true });
                } else if (authData.user.userType === 'admin') {
                    navigate('/admin/dashboard', { replace: true });
                } else if (authData.user.userType === 'staff') {
                    navigate('/staff/dashboard', { replace: true });
                } else {
                    // Customers shouldn't really use this portal login, but just in case:
                    navigate('/', { replace: true });
                }
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Authentication failed. Invalid credentials.');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="font-serif text-2xl text-salon-primary mb-2">Sign In</h1>
                <p className="font-sans text-xs text-salon-muted">Enter your credentials to access the portal</p>
            </div>

            {error && (
                <div className="mb-6 rounded bg-red-500/10 border border-red-500/50 p-3 text-center text-xs text-red-500 font-sans tracking-wide">
                    {error}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] uppercase font-medium tracking-widest text-salon-primary mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        {...formik.getFieldProps('email')}
                        className={`w-full bg-salon-surface/50 border ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : 'border-salon-golden/20'} rounded p-3 text-sm text-salon-primary placeholder-salon-muted focus:outline-none focus:border-salon-golden transition-colors`}
                        placeholder="admin@salonsaleh.com"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="mt-1.5 text-[10px] text-red-500 uppercase tracking-wider">{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] uppercase font-medium tracking-widest text-salon-primary">
                            Password
                        </label>
                        <Link to="/forgot-password" className="text-[10px] text-salon-golden-muted hover:text-salon-golden transition-colors">
                            Forgot Password ?
                        </Link>
                    </div>
                    <input
                        type="password"
                        {...formik.getFieldProps('password')}
                        className={`w-full bg-salon-surface/50 border ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : 'border-salon-golden/20'} rounded p-3 text-sm text-salon-primary placeholder-salon-muted focus:outline-none focus:border-salon-golden transition-colors`}
                        placeholder="••••••••"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="mt-1.5 text-[10px] text-red-500 uppercase tracking-wider">{formik.errors.password}</p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative flex justify-center items-center py-3.5 border border-salon-golden bg-salon-golden/10 hover:bg-salon-golden text-salon-golden hover:text-black font-sans text-xs uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-salon-golden" />
                        ) : (
                            <span className="relative z-10 font-bold">Authenticate</span>
                        )}
                    </button>
                </div>
            </form>

            {/* Removed the 'Register' link completely entirely as requested in plan */}
        </div>
    );
};

export default LoginPage;
