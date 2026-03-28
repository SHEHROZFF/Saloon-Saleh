import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';

const products = [
    {
        id: "01",
        title: "Scalp Clinix Oil Control",
        brand: "Schwarzkopf Professional",
        price: "35.00",
        img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "02",
        title: "Matte Clay Armada",
        brand: "Armada",
        price: "15.00",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "03",
        title: "BonaCure Color Freeze",
        brand: "Schwarzkopf Professional",
        price: "32.00",
        img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "04",
        title: "Paste - Matte Finish",
        brand: "Saloon Saleh",
        price: "20.00",
        img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "05",
        title: "Keune Shampoo Stick",
        brand: "J.M. Keune",
        price: "30.00",
        img: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "06",
        title: "2000W Hair Dryer",
        brand: "Professional",
        price: "60.00",
        img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const ProductsCarousel = () => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const { addToCart } = useCart();

    // Re-calculate drag width on window resize
    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };
        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const handleAddToCart = (product: any, e: React.MouseEvent) => {
        e.stopPropagation(); // prevent drag trigger
        addToCart({
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            img: product.img
        });

        // simple visual feedback could be added here
    };

    return (
        <section id="products" className="py-12 md:py-24 bg-salon-base relative z-10 w-full overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-6 md:px-16 mb-4 md:mb-6">
                <SectionHeader 
                    title="Best Selling" 
                    italicTitle="Collection" 
                    description="Drag to explore"
                    layout="side"
                    stackTitle={true}
                    border={false}
                    className="mb-6"
                />
            </div>

            {/* Draggable Carousel */}
            <motion.div ref={carouselRef} className="cursor-grab overflow-hidden active:cursor-grabbing px-6 md:px-16" whileTap={{ cursor: "grabbing" }}>
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    className="flex gap-6 md:gap-14 w-max"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="min-w-[240px] md:min-w-[380px] flex flex-col group"
                        >
                            {/* Product Image Box */}
                            <div className="w-full h-[250px] md:h-[450px] bg-salon-surface relative overflow-hidden flex items-center justify-center p-6 md:p-10 border border-transparent group-hover:border-salon-golden/10 transition-colors duration-500">
                                <div className="absolute inset-0 bg-salon-surface opacity-100 transition-opacity duration-1000 group-hover:opacity-0 pointer-events-none z-10 mix-blend-color"></div>
                                <span className="absolute top-4 left-4 md:top-6 md:left-6 text-xl md:text-2xl font-serif text-salon-golden/10 leading-none z-0 transition-colors duration-500 group-hover:text-salon-golden/30">
                                    {product.id}
                                </span>
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    draggable="false" // prevents native drag interfering
                                    className="w-auto h-full object-contain mix-blend-luminosity opacity-70 group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1500ms] drop-shadow-2xl z-20 relative pointer-events-none"
                                />
                                {/* Add to Bag Button */}
                                <Button
                                    variant="icon-golden"
                                    onClick={(e) => handleAddToCart(product, e)}
                                    className="absolute bottom-6 right-6 w-9 md:w-11 h-9 md:h-11 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 z-30 hover:scale-110 active:scale-95 shadow-[0_10px_30px_rgba(197,160,89,0.3)] transition-all duration-300"
                                    title="Add to Cart"
                                >
                                    <svg className="w-4 h-4 text-salon-base" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                </Button>
                            </div>

                            {/* Info */}
                            <div className="flex flex-col mt-4 md:mt-5">
                                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-salon-golden-muted mb-1.5">{product.brand}</span>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-sm md:text-lg font-serif text-salon-primary max-w-[70%]">{product.title}</h3>
                                    <span className="text-xs md:text-base font-serif text-salon-golden">${product.price}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

        </section>
    );
};

export default ProductsCarousel;
