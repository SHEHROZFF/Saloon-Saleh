import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { useGetBootstrapSettings } from '../../hooks/queries/useSettings';

interface HeroButton {
    label: string;
    link: string;
    variant: "golden" | "golden-outline" | "white" | "ghost" | "link";
}

interface HeroSlide {
    tagline: string;
    title: string;
    italicTitle: string;
    description: string;
    img: string;
    buttons: HeroButton[];
}

const defaultSlides: HeroSlide[] = [
    {
        tagline: "The Modern Edge",
        title: "Meticulous",
        italicTitle: "Precision.",
        description: "It's an art we take seriously. Experience bespoke styling crafted for the uncompromising individual. Be the energy you want to attract.",
        img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        buttons: [
            { label: "Book Now", link: "/booking", variant: "golden" },
            { label: "Join Waitlist", link: "/booking", variant: "golden-outline" }
        ]
    },
    {
        tagline: "Timeless Tradition",
        title: "Bespoke",
        italicTitle: "Grooming.",
        description: "Discover a sanctuary of modern luxury where traditional master barbering meets contemporary sophisticated aesthetics.",
        img: "https://plus.unsplash.com/premium_photo-1683121230718-3256f14d08ac?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        buttons: [
            { label: "Book Now", link: "/booking", variant: "golden" },
            { label: "Our Services", link: "/shop", variant: "golden-outline" }
        ]
    },
    {
        tagline: "Exclusive Experience",
        title: "Absolute",
        italicTitle: "Mastery.",
        description: "Our master craftspeople deliver unparalleled attention to detail, maintaining the absolute highest standards in the industry.",
        img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        buttons: [
            { label: "Book Now", link: "/booking", variant: "golden" },
            { label: "View Collection", link: "/shop", variant: "golden-outline" }
        ]
    }
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { data: bootstrapData } = useGetBootstrapSettings();

    const rawSlides = bootstrapData?.data?.hero_slides;
    const slides: HeroSlide[] = rawSlides?.length ? rawSlides : defaultSlides;

    useEffect(() => {
        if (!slides || slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides]);

    const slide = slides[currentSlide];

    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-salon-base border-b border-salon-surface flex flex-col">

            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide?.title || currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-[#050505] z-10" />
                        <img
                            src={slide.img}
                            alt="Salon Saleh Hero"
                            className="w-full h-full object-cover filter grayscale-[30%] object-[center_30%]"
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dynamic Content Layer */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-between py-24 md:py-12 px-6 md:px-12 w-full max-w-[1400px] mx-auto overflow-y-auto md:overflow-hidden min-h-screen md:min-h-0">

                <div className="hidden md:block h-10" />

                <div className="flex flex-col items-center justify-center text-center w-full flex-1 mb-8 md:mb-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide?.title || currentSlide}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-salon-golden mb-5">
                                {slide.tagline}
                            </span>

                            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-serif leading-[0.9] tracking-tight text-white drop-shadow-2xl mb-6">
                                {slide.title} <br />
                                <span className="italic text-white/90">{slide.italicTitle}</span>
                            </h1>

                            <p className="text-[11px] md:text-sm max-w-xs md:max-w-lg font-light leading-relaxed text-white/80 mb-10">
                                {slide.description}
                            </p>

                            {/* Dynamically Rendered Buttons from Data Source */}
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                {slide?.buttons?.map((btn, index) => (
                                    <Button
                                        key={`slide-btn-${index}`}
                                        as="a"
                                        href={btn.link}
                                        variant={btn.variant}
                                        className="w-full sm:w-auto min-w-[180px] h-11 md:h-12 tracking-widest text-[10px] !text-white"
                                    >
                                        {btn.label}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Dots - Part of flow, with increased spacing from content */}
                <div className="flex gap-4 items-center justify-center py-8 md:py-0 md:mt-6">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`group relative h-8 px-1 flex items-center justify-center transition-all duration-300`}
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                            <span className={`w-8 md:w-16 h-[2px] transition-all duration-500 rounded-full ${currentSlide === idx ? 'bg-salon-golden md:bg-white scale-x-110' : 'bg-white/20 group-hover:bg-white/50'}`} />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
