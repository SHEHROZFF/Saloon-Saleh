import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface DecorativeCardProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;
    animate?: boolean;
    delay?: number;
}

const DecorativeCard: React.FC<DecorativeCardProps> = ({
    children,
    className,
    padding = 'p-4 md:p-8',
    animate = true,
    delay = 0
}) => {
    const Component = animate ? motion.div : 'div';
    
    return (
        <Component 
            {...(animate ? {
                initial: { opacity: 0, y: 30 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.8, delay }
            } : {})}
            className={clsx(
                'bg-salon-surface border border-salon-primary/5 shadow-2xl relative transition-all duration-500 overflow-hidden',
                padding,
                className
            )}
        >
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-salon-golden opacity-50"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-salon-golden opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-salon-golden opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-salon-golden opacity-50"></div>
            
            {children}
        </Component>
    );
};

export default DecorativeCard;
