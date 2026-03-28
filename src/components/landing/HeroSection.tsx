import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

const slides = [
    // ... (rest of slides remains same)
    {
        id: 1,
        tagline: "The Modern Edge",
        title: "Meticulous",
        italicTitle: "Precision.",
        description: "It's an art we take seriously. Experience bespoke styling crafted for the uncompromising individual. Be the energy you want to attract.",
        img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    },
    {
        id: 2,
        tagline: "Timeless Tradition",
        title: "Bespoke",
        italicTitle: "Grooming.",
        description: "Discover a sanctuary of modern luxury where traditional master barbering meets contemporary sophisticated aesthetics.",
        img: "https://plus.unsplash.com/premium_photo-1683121230718-3256f14d08ac?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 3,
        tagline: "Exclusive Experience",
        title: "Absolute",
        italicTitle: "Mastery.",
        description: "Our master craftspeople deliver unparalleled attention to detail, maintaining the absolute highest standards in the industry.",
        img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = slides[currentSlide];

    return (
        <section className="relative w-full min-h-[100svh] overflow-hidden bg-salon-base flex items-center justify-center border-b border-salon-surface pt-16 pb-4 md:py-0">

            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-10" />
                    <img
                        src={slide.img}
                        alt="Saloon Saleh Hero"
                        className="w-full h-full object-cover filter grayscale-[40%] object-[center_30%]"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Mobile-Responsive Typography Fixes */}
            <div className="relative z-20 flex flex-col items-center text-center px-4 md:px-8 w-full h-full justify-center mt-4 md:mt-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center w-full"
                    >
                        <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] text-salon-golden mb-3 md:mb-5">
                            {slide.tagline}
                        </span>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[7.5rem] font-serif leading-[0.9] tracking-tight text-white drop-shadow-2xl">
                            {slide.title} <br />
                            <span className="italic text-white/90">{slide.italicTitle}</span>
                        </h1>

                        <p className="mt-3 text-[10px] md:text-xs max-w-xs md:max-w-md font-light leading-relaxed text-white/80">
                            {slide.description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-3 md:mt-6 flex flex-col sm:flex-row items-center gap-4 z-30 relative w-full sm:w-auto px-6 mb-4 md:mb-0"
                >
                    <Button variant="golden" size="sm" className="w-full sm:w-auto">
                        <span>Book Now</span>
                    </Button>
                    <Button as="a" href="#booking" variant="golden-outline" size="sm" className="w-full sm:w-auto">
                        <span>Join Waitlist</span>
                    </Button>
                </motion.div>
            </div>

            <div className="absolute bottom-10 md:bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-8 md:w-12 h-[2px] transition-all duration-500 ${currentSlide === idx ? 'bg-white' : 'bg-white/20 hover:bg-white/50'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
