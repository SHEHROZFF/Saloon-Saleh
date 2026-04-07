import React from 'react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="flex relative min-h-screen items-center justify-center bg-salon-base overflow-hidden selection:bg-salon-golden selection:text-salon-base">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1521590832167-7bfcbaa6362d?q=80&w=2070&auto=format&fit=crop"
                    alt="Saloon Interior"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-salon-base via-salon-base/90 to-transparent"></div>
            </div>

            {/* Glowing accents */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-salon-golden/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-salon-golden/5 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md px-4 sm:px-0"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <img src="/Main_logo_wo_BG.png" alt="Saloon Saleh Logo" className="w-16 h-16 object-contain mb-4 z-10" />
                    <h2 className="font-serif text-3xl tracking-widest text-salon-primary uppercase text-center mb-1">
                        Saloon Saleh
                    </h2>
                    <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-salon-golden-muted">
                        Staff & Admin Portal
                    </p>
                </div>

                {/* Form Container */}
                <div className="relative backdrop-blur-md bg-salon-surface/60 border border-salon-golden/20 rounded-lg shadow-2xl p-8 sm:p-10 after:absolute after:inset-0 after:rounded-lg after:border after:border-salon-golden/10 after:pointer-events-none">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default AuthLayout;
