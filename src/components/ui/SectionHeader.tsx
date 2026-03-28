import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SectionHeaderProps {
    title: string;
    italicTitle: string;
    description?: string;
    layout?: 'stack' | 'side';
    align?: 'left' | 'center';
    border?: boolean;
    className?: string;
    children?: React.ReactNode;
    stackTitle?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    italicTitle,
    description,
    layout = 'side',
    align = 'left',
    border = true,
    className,
    children,
    stackTitle = false
}) => {
    const isCenter = align === 'center';
    const isStack = layout === 'stack';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className={clsx(
                'w-full flex mb-6',
                isCenter ? 'flex-col items-center text-center' : 'flex-col md:flex-row justify-between items-start md:items-end',
                border && !isCenter && 'border-b border-salon-surface pb-4',
                className
            )}
        >
            <div className={clsx('flex flex-col', isCenter && 'items-center')}>
                <h2 className={clsx(
                    'font-serif font-normal tracking-tight leading-[1] text-salon-primary',
                    align === 'left' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'
                )}>
                    {title} {(isStack || stackTitle) ? <br /> : ' '}
                    <span className="italic text-salon-golden">{italicTitle}</span>
                </h2>
                
                {description && isStack && (
                    <p className="mt-4 text-[11px] md:text-xs text-salon-golden-muted max-w-sm leading-relaxed font-light">
                        {description}
                    </p>
                )}
            </div>

            {description && !isStack && (
                <p className={clsx(
                    'text-salon-golden-muted font-light leading-relaxed max-w-sm',
                    'mt-4 md:mt-0 text-[9px] md:text-[10px] uppercase tracking-wide',
                    layout === 'side' && 'md:max-w-[280px] text-right'
                )}>
                    {description}
                </p>
            )}
            
            {children}
        </motion.div>
    );
};

export default SectionHeader;
