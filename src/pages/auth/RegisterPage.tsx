import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { authService } from '@services/api/authService';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
});

const RegisterPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async values => {
            try {
                setLoading(true);
                setError('');
                const response = await authService.register(values);
                dispatch(setCredentials(response.data));
                navigate('/dashboard');
            } catch (err: any) {
                setError(err.message || 'Registration failed');
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="rounded-lg bg-white p-8 shadow-xl">
            <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="mt-2 text-gray-600">Sign up to get started</p>
            </div>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    type="text"
                    {...formik.getFieldProps('name')}
                    error={formik.touched.name ? formik.errors.name : undefined}
                />

                <Input
                    label="Email"
                    type="email"
                    {...formik.getFieldProps('email')}
                    error={formik.touched.email ? formik.errors.email : undefined}
                />

                <Input
                    label="Password"
                    type="password"
                    {...formik.getFieldProps('password')}
                    error={formik.touched.password ? formik.errors.password : undefined}
                />

                <Button type="submit" fullWidth loading={loading}>
                    Sign Up
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default RegisterPage;
