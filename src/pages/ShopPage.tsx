import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shopProducts, Product } from '../services/mockData';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';
import ProductPopup from '../components/shop/ProductPopup';

const ShopPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

            <main className="pt-40 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
                <ProductPopup
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />

                {/* Hero / Header Section */}
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] uppercase tracking-[0.5em] text-salon-golden mb-4 font-bold"
                    >
                        Professional Care
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-serif mb-8 tracking-tighter"
                    >
                        The <span className="italic">Collection.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[13px] text-salon-golden-muted max-w-xl font-light leading-[1.8] tracking-[0.05em]"
                    >
                        Elevate your grooming ritual with our curated selection of premium products,
                        trusted by our master barbers and specifically designed for the uncompromising individual.
                    </motion.p>
                </div>

                {/* Filters & Search - Professional Two-Row Layout */}
                <div className="flex flex-col gap-10 mb-20 border-b border-salon-golden/10 pb-12">
                    {/* Row 1: Category Navigation (Scrollable with Indicators) */}
                    <div className="relative group">
                        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1">
                            {categories.map(cat => (
                                <Button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    variant={selectedCategory === cat ? 'golden' : 'golden-outline'}
                                    size="sm"
                                    className="whitespace-nowrap shrink-0 min-w-[120px] h-11 tracking-[0.2em] font-bold"
                                >
                                    {cat}
                                </Button>
                            ))}
                        </div>
                        {/* Subtle Scroll Faders */}
                        <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-salon-base to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-salon-base to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                layout
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.6, delay: index * 0.03 }}
                                className="group cursor-pointer"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="relative aspect-[4/5] bg-salon-surface overflow-hidden mb-8 border border-salon-golden/5 group-hover:border-salon-golden/20 transition-all duration-500 shadow-lg group-hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)]">
                                    <img
                                        src={product.img}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0"
                                    />

                                    {/* Action Reveal */}
                                    <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out z-10">
                                        <div className="backdrop-blur-xl bg-salon-base/80 border border-salon-golden/20 p-4 flex items-center justify-between group shadow-xl">
                                            <span className="text-[10px] uppercase tracking-widest font-bold">View Ritual</span>
                                            <svg className="w-4 h-4 text-salon-golden transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-1.5 text-[9px] uppercase tracking-[0.3em] font-bold border border-salon-golden/30 text-salon-golden">
                                        {product.category}
                                    </div>
                                </div>
                                <div className="flex justify-between items-start px-2">
                                    <div className="space-y-2">
                                        <p className="text-[11px] uppercase tracking-[0.3em] text-salon-golden/60 font-bold">{product.brand}</p>
                                        <h3 className="text-2xl font-serif text-salon-primary group-hover:text-salon-golden transition-all duration-500 tracking-tight">
                                            {product.title}
                                        </h3>
                                    </div>
                                    <span className="text-xl font-serif mt-5 tracking-tighter">${product.price}</span>
                                </div>
                                <p className="mt-4 text-[12px] text-salon-golden-muted/60 font-light leading-relaxed max-w-[95%] px-2 line-clamp-2">
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
