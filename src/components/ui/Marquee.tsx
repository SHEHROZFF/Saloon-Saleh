import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
    text: string;
    speed?: number; // Duration in seconds
}

const Marquee: React.FC<MarqueeProps> = ({ text, speed = 15 }) => {
    return (
        <div className="w-full overflow-hidden bg-salon-base py-4 border-y border-salon-golden/10 flex whitespace-nowrap relative z-20 transition-colors duration-500">
            <motion.div
                className="flex gap-16 md:gap-32 whitespace-nowrap min-w-full items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 30 / speed, repeat: Infinity, ease: "linear" }}
            >
                <div className="flex gap-16 md:gap-32 items-center">
                    <span className="text-3xl md:text-5xl font-serif text-salon-primary tracking-tighter opacity-80 uppercase italic">{text}</span>
                    <span className="w-2 h-2 rounded-full bg-salon-golden opacity-50"></span>
                    <span className="text-3xl md:text-5xl font-serif text-salon-primary tracking-tighter opacity-80 uppercase italic">{text}</span>
                    <span className="w-2 h-2 rounded-full bg-salon-golden opacity-50"></span>
                </div>
                <div className="flex gap-16 md:gap-32 items-center">
                    <span className="text-3xl md:text-5xl font-serif text-salon-primary tracking-tighter opacity-80 uppercase italic">{text}</span>
                    <span className="w-2 h-2 rounded-full bg-salon-golden opacity-50"></span>
                    <span className="text-3xl md:text-5xl font-serif text-salon-primary tracking-tighter opacity-80 uppercase italic">{text}</span>
                    <span className="w-2 h-2 rounded-full bg-salon-golden opacity-50"></span>
                </div>
            </motion.div>
        </div>
    );
};

export default Marquee;
