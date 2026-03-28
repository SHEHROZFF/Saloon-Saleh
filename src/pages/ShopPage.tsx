import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { shopProducts } from '../services/mockData';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';

const ShopPage = () => {
    const { addToCart } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', ...new Set(shopProducts.map(p => p.category))];

    const filteredProducts = useMemo(() => {
        let result = shopProducts.filter(p => 
            (selectedCategory === 'All' || p.category === selectedCategory) &&
            (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (sortBy === 'price-low') {
            result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        return result;
    }, [selectedCategory, sortBy, searchQuery]);

    return (
        <div className="w-full min-h-screen bg-salon-base text-salon-primary selection:bg-salon-golden selection:text-salon-base">
            <Header />
            
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                {/* Hero / Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-salon-golden mb-4"
                    >
                        Professional Care
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif mb-6"
                    >
                        The <span className="italic">Collection.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-salon-golden-muted max-w-xl font-light leading-relaxed"
                    >
                        Elevate your grooming ritual with our curated selection of premium products, 
                        trusted by our master barbers and specifically designed for the uncompromising individual.
                    </motion.p>
                </div>

                {/* Filters & Search Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-salon-golden/10 pb-8">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
                                    selectedCategory === cat 
                                    ? 'bg-salon-primary text-salon-base border-salon-primary' 
                                    : 'border-salon-golden/20 text-salon-golden-muted hover:border-salon-golden hover:text-salon-primary'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <input 
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-salon-surface border border-salon-golden/10 px-4 py-2 text-xs focus:outline-none focus:border-salon-golden transition-colors"
                            />
                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-salon-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-salon-surface border border-salon-golden/10 px-4 py-2 text-[10px] uppercase tracking-widest outline-none focus:border-salon-golden cursor-pointer"
                        >
                            <option value="featured">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className="group"
                            >
                                <div className="relative aspect-[4/5] bg-salon-surface overflow-hidden mb-6 border border-salon-golden/5">
                                    <img 
                                        src={product.img} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-6">
                                        <Button 
                                            onClick={() => addToCart({
                                                id: product.id,
                                                title: product.title,
                                                brand: product.brand,
                                                price: product.price,
                                                img: product.img
                                            })}
                                            variant="white" 
                                            className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                                        >
                                            Add to Bag
                                        </Button>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-salon-base/90 backdrop-blur-sm px-3 py-1 text-[8px] uppercase tracking-[0.2em] border border-salon-golden/20">
                                        {product.category}
                                    </div>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-salon-golden mb-1">{product.brand}</p>
                                        <h3 className="text-xl font-serif text-salon-primary group-hover:text-salon-golden transition-colors duration-300">
                                            {product.title}
                                        </h3>
                                    </div>
                                    <span className="text-lg font-serif">${product.price}</span>
                                </div>
                                <p className="mt-2 text-[11px] text-salon-golden-muted font-light leading-relaxed max-w-[90%]">
                                    {product.description}
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-salon-golden-muted italic">No products found matching your criteria.</p>
                        <Button 
                            variant="link" 
                            className="mt-4 text-salon-golden"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSearchQuery('');
                            }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ShopPage;
