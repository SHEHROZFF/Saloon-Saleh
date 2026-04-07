import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
    items: string[];
    speed?: number; // Duration in seconds
}

const Marquee: React.FC<MarqueeProps> = ({ items = [], speed = 15 }) => {
    // Fallback if items is empty
    const displayItems = items.length > 0 ? items : ["HIGH-END LUXURY SALON"];

    // We render multiple copies to ensure seamless loop
    const MarqueeContent = () => (
        <React.Fragment>
            {displayItems.map((text, idx) => (
                <React.Fragment key={idx}>
                    <span className="text-3xl md:text-5xl font-serif text-salon-primary tracking-tighter opacity-80 uppercase italic">{text}</span>
                    <span className="w-2 h-2 rounded-full bg-salon-golden opacity-50"></span>
                </React.Fragment>
            ))}
        </React.Fragment>
    );

    return (
        <div className="w-full overflow-hidden bg-salon-base py-4 border-y border-salon-golden/10 flex whitespace-nowrap relative z-20 transition-colors duration-500">
            <div className="flex w-max min-w-full gap-16 md:gap-32">
                <motion.div
                    className="flex shrink-0 gap-16 md:gap-32 items-center min-w-full"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{ duration: 30 / speed, repeat: Infinity, ease: "linear" }}
                >
                    <MarqueeContent />
                </motion.div>
                <motion.div
                    className="flex shrink-0 gap-16 md:gap-32 items-center min-w-full"
                    animate={{ x: ["0%", "-100%"] }}
                    transition={{ duration: 30 / speed, repeat: Infinity, ease: "linear" }}
                >
                    <MarqueeContent />
                </motion.div>
            </div>
        </div>
    );
};

export default Marquee;
