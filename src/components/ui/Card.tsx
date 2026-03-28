import clsx from 'clsx';

interface CardProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const Card = ({ title, children, className }: CardProps) => {
    return (
        <div className={clsx('rounded-lg border bg-white p-6 shadow-sm', className)}>
            {title && <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
