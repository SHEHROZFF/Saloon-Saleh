import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetProducts, useGetProductCategories } from '../hooks/queries/useProducts';
import { Product } from '../services/api/productService';
import Header from '../components/layout/Header';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';
import ProductPopup from '../components/shop/ProductPopup';
import { Loader2 } from 'lucide-react';

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
    const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || 'All');
    const [sortBy, setSortBy] = useState('price-low');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Sync state with URL params if they change
    useEffect(() => {
        const cat = searchParams.get('category');
        const brd = searchParams.get('brand');
        if (cat) setSelectedCategory(cat);
        if (brd) setSelectedBrand(brd);
    }, [searchParams]);

    const { data: productsData, isLoading } = useGetProducts({ search: searchQuery });
    const { data: categoriesData } = useGetProductCategories();

    const products: Product[] = (productsData?.data as any)?.products || productsData?.data || [];
    const dbCategoriesList = (categoriesData?.data as any)?.categories || categoriesData?.data || [];
    const dbCategories = dbCategoriesList.map((c: any) => c.name) || [];
    const categories = ['All', ...new Set([...dbCategories])];

    const filteredProducts = useMemo(() => {
        let result = [...products];
        
        if (selectedCategory !== 'All') {
            const desiredCategory = dbCategoriesList.find((c: any) => c.name === selectedCategory);
            if (desiredCategory) {
               result = result.filter(p => p.category_id === desiredCategory.id);
            }
        }

        if (selectedBrand !== 'All') {
            result = result.filter(p => p.brand === selectedBrand);
        }

        // Sort logic (separate from filtering)
        if (sortBy === 'price-low') {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'featured') {
            // Featured items first, then by sort_order
            result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        }

        return result;
    }, [products, selectedCategory, selectedBrand, sortBy, categoriesData]);

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
                                    onClick={() => {
                                        setSelectedCategory(cat);
                                        setSearchParams(prev => {
                                            if (cat === 'All') prev.delete('category');
                                            else prev.set('category', cat);
                                            return prev;
                                        });
                                    }}
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

                    {/* Quick Filter Status */}
                    {(selectedCategory !== 'All' || selectedBrand !== 'All' || searchQuery) && (
                        <div className="flex flex-wrap gap-3 items-center">
                            <span className="text-[9px] uppercase tracking-widest text-salon-golden-muted font-bold mr-2">Active Filters:</span>
                            {selectedCategory !== 'All' && (
                                <button onClick={() => { setSelectedCategory('All'); setSearchParams(p => { p.delete('category'); return p; }); }} className="bg-salon-golden/10 border border-salon-golden/30 px-3 py-1 text-[10px] text-salon-golden flex items-center gap-2 hover:bg-salon-golden/20 transition-colors">
                                    Cat: {selectedCategory} <span className="opacity-60">×</span>
                                </button>
                            )}
                            {selectedBrand !== 'All' && (
                                <button onClick={() => { setSelectedBrand('All'); setSearchParams(p => { p.delete('brand'); return p; }); }} className="bg-salon-golden/10 border border-salon-golden/30 px-3 py-1 text-[10px] text-salon-golden flex items-center gap-2 hover:bg-salon-golden/20 transition-colors">
                                    Brand: {selectedBrand} <span className="opacity-60">×</span>
                                </button>
                            )}
                            {(selectedCategory !== 'All' || selectedBrand !== 'All') && (
                                <button 
                                    onClick={() => { 
                                        setSelectedCategory('All'); 
                                        setSelectedBrand('All'); 
                                        setSearchParams({}); 
                                    }} 
                                    className="text-[9px] uppercase tracking-widest text-salon-primary hover:text-white transition-colors underline underline-offset-4 decoration-salon-golden/30 ml-4"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    )}

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
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="featured">Featured First</option>
                            <option value="newest">Newest</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-salon-golden" />
                        <p className="text-sm font-serif text-salon-golden-muted tracking-widest uppercase">Curating the collection...</p>
                    </div>
                ) : (
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
                                        src={product.image_url}
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
                                        {dbCategoriesList.find((c: any) => c.id === product.category_id)?.name || 'Product'}
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
                )}

                {filteredProducts.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-salon-golden-muted italic">No products found matching your criteria.</p>
                        <Button
                            variant="link"
                            className="mt-4 text-salon-golden"
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedBrand('All');
                                setSearchQuery('');
                                setSearchParams({});
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
