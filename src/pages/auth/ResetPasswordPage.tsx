import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '@services/api/authService';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const validationSchema = Yup.object({
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Missing or invalid reset token. Please request a new link.');
        }
    }, [token]);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async values => {
            if (!token) return;
            try {
                setLoading(true);
                setError('');
                await authService.resetPassword(token, values.password);
                setSuccess(true);
                setTimeout(() => {
                    navigate('/auth/login');
                }, 3000);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        },
    });

    if (success) {
        return (
            <div className="w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                </div>
                <h1 className="font-serif text-2xl text-salon-primary mb-3">Password Reset</h1>
                <p className="font-sans text-xs text-salon-muted mb-8 leading-relaxed">
                    Your password has been successfully updated. Redirecting you to login...
                </p>
                <Link 
                    to="/auth/login"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-salon-golden hover:text-white transition-colors underline underline-offset-4"
                >
                    Sign in now
                </Link>
            </div>
        );
    }

    if (!token && error) {
        return (
            <div className="w-full text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                        <AlertCircle className="w-8 h-8" />
                    </div>
                </div>
                <h1 className="font-serif text-2xl text-salon-primary mb-3">Invalid Link</h1>
                <p className="font-sans text-xs text-salon-muted mb-8 leading-relaxed">
                    {error}
                </p>
                <Link 
                    to="/auth/forgot-password"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-salon-golden hover:text-white transition-colors"
                >
                    Request New Link
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="font-serif text-2xl text-salon-primary mb-2">Reset Password</h1>
                <p className="font-sans text-xs text-salon-muted">Enter your new password below to regain access.</p>
            </div>

            {error && (
                <div className="mb-6 rounded bg-red-500/10 border border-red-500/50 p-3 text-center text-xs text-red-500 font-sans tracking-wide">
                    {error}
                </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-[10px] uppercase font-medium tracking-widest text-salon-primary mb-2">
                        New Password
                    </label>
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

                <div>
                    <label className="block text-[10px] uppercase font-medium tracking-widest text-salon-primary mb-2">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        {...formik.getFieldProps('confirmPassword')}
                        className={`w-full bg-salon-surface/50 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500/50' : 'border-salon-golden/20'} rounded p-3 text-sm text-salon-primary placeholder-salon-muted focus:outline-none focus:border-salon-golden transition-colors`}
                        placeholder="••••••••"
                    />
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                        <p className="mt-1.5 text-[10px] text-red-500 uppercase tracking-wider">{formik.errors.confirmPassword}</p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full relative flex justify-center items-center py-3.5 border border-salon-golden bg-salon-golden/10 hover:bg-salon-golden text-salon-golden hover:text-black font-sans text-xs uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-salon-golden" />
                        ) : (
                            <span className="relative z-10 font-bold">Update Password</span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
