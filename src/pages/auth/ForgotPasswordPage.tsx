import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authService } from '@services/api/authService';
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPasswordPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema,
        onSubmit: async values => {
            try {
                setLoading(true);
                setError('');
                await authService.forgotPassword(values.email);
                setSuccess(true);
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
                    <div className="w-16 h-16 rounded-full bg-salon-golden/10 flex items-center justify-center text-salon-golden border border-salon-golden/20">
                        <MailCheck className="w-8 h-8" />
                    </div>
                </div>
                <h1 className="font-serif text-2xl text-salon-primary mb-3">Check Your Email</h1>
                <p className="font-sans text-xs text-salon-muted mb-8 leading-relaxed">
                    If an account exists for {formik.values.email}, you will receive a password reset link shortly.
                </p>
                <Link 
                    to="/auth/login"
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-salon-golden hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-8 text-center">
                <h1 className="font-serif text-2xl text-salon-primary mb-2">Forgot Password?</h1>
                <p className="font-sans text-xs text-salon-muted">Enter your email and we'll send you a link to reset your password.</p>
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full relative flex justify-center items-center py-3.5 border border-salon-golden bg-salon-golden/10 hover:bg-salon-golden text-salon-golden hover:text-black font-sans text-xs uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-salon-golden" />
                        ) : (
                            <span className="relative z-10 font-bold">Send Reset Link</span>
                        )}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <Link 
                        to="/auth/login"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-salon-golden-muted hover:text-salon-golden transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
