import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = ({ label, error, className, ...props }: InputProps) => {
    return (
        <div className="w-full">
            {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
            <input
                className={clsx(
                    'w-full rounded-md border px-3 py-2 text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500',
                    error ? 'border-red-500' : 'border-gray-300',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default Input;
