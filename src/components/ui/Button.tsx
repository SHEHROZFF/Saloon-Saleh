import { ButtonHTMLAttributes, ElementType } from 'react';
import clsx from 'clsx';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'golden' | 'white' | 'white-outline' | 'golden-outline' | 'link' | 'icon-golden' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
    loading?: boolean;
    as?: ElementType;
    href?: string;
}

const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    as: Component = 'button',
    children,
    className,
    disabled,
    ...props
}: ButtonProps) => {
    const isLandingVariant = ['golden', 'white', 'white-outline', 'golden-outline', 'primary'].includes(variant);

    const sizeStyles = {
        sm: isLandingVariant ? 'px-4 md:px-6 py-2 md:py-3 text-[8px] md:text-[10px]' : 'px-2 py-1 text-xs',
        md: isLandingVariant ? 'px-8 md:px-10 py-4 md:py-5 text-[10px] md:text-xs' : 'px-4 py-2 text-sm',
        lg: isLandingVariant ? 'px-10 md:px-14 py-5 md:py-6 text-xs md:text-sm' : 'px-6 py-3 text-base',
        icon: 'p-0 w-10 h-10',
    };

    const baseStyles = isLandingVariant
        ? clsx('sleek-btn transition-all duration-300 inline-flex items-center justify-center', variant === 'golden' && 'sleek-btn-golden')
        : variant === 'icon-golden'
        ? 'inline-flex items-center justify-center transition-all duration-500 rounded-full'
        : 'inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles: Record<string, string> = {
        primary: 'rounded-none font-medium bg-salon-golden text-salon-base hover:bg-salon-primary hover:text-salon-base border border-salon-golden',
        secondary: 'rounded-md font-medium bg-gray-600 text-white hover:bg-gray-700',
        outline: 'rounded-md font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        golden: '', 
        white: 'bg-white text-black hover:bg-black hover:text-white border border-white hover:border-black font-medium',
        'white-outline': 'bg-black/50 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-black font-medium',
        'golden-outline': 'bg-black/50 backdrop-blur-sm border-salon-golden/40 text-salon-golden hover:bg-salon-golden hover:text-salon-base font-medium',
        link: 'p-0 h-auto hover:opacity-70',
        'icon-golden': 'bg-salon-golden text-salon-base hover:scale-110 active:scale-95 transition-all text-white',
        ghost: 'p-2 h-auto hover:bg-white/5',
    };

    return (
        <Component
            className={clsx(
                baseStyles,
                // @ts-ignore
                variantStyles[variant],
                // @ts-ignore
                sizeStyles[size],
                fullWidth && 'w-full',
                loading && 'cursor-wait',
                className
            )}
            disabled={disabled || loading}
            {...props}>
            {loading ? (
                <>
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : isLandingVariant ? (
                <span>{children}</span>
            ) : (
                children
            )}
        </Component>
    );
};

export default Button;
