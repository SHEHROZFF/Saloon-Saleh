import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AdminSlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const AdminSlideOver: React.FC<AdminSlideOverProps> = ({ isOpen, onClose, title, children }) => {
    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Transparent Clickable Backdrop */}
                    <div 
                        className="fixed inset-0 z-[99]" 
                        onClick={onClose}
                    />

                    {/* Sliding Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen z-[100] w-full max-w-md bg-salon-base border-l border-salon-golden/20 shadow-[-10px_0_30px_rgba(0,0,0,0.3)] flex flex-col"
                    >
                        <div className="flex justify-between items-center px-6 py-5 border-b border-salon-golden/10 bg-salon-surface/30">
                            <h3 className="text-xl font-serif text-salon-primary">{title}</h3>
                            <button
                                onClick={onClose}
                                className="text-salon-muted hover:text-salon-golden transition-colors p-2 -mr-2 rounded-full hover:bg-salon-golden/10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 sleek-scrollbar pb-24">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AdminSlideOver;
