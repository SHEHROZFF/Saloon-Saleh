import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import ProductPopup from '../shop/ProductPopup';
import { shopProducts, Product } from '../../services/mockData';

const categories = [
    { name: "Bonacure", count: "3 Products" },
    { name: "Eau de Toilette", count: "1 Product" },
    { name: "Hair & Beard", count: "41 Products" },
    { name: "Scalp Clinix", count: "2 Products" },
    { name: "Skincare", count: "17 Products" },
];

const ProductsPreview = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Using first 4 products from mockData for consistency
    const displayProducts = shopProducts.slice(0, 4);

    return (
        <section id="products-preview" className="py-20 md:py-28 bg-salon-base relative z-10 w-full overflow-hidden">
            <ProductPopup 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
            />
            
            <div className="w-full max-w-[1400px] mx-auto px-8 md:px-16">

                <SectionHeader
                    title="Best Selling"
                    italicTitle="Products"
                >
                    <div className="flex flex-col mt-4 md:mt-0 gap-4 text-right">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-salon-golden-muted">Browse Categories</span>
                        <div className="flex gap-6 max-w-[300px] flex-wrap justify-end">
                            {categories.map((cat, idx) => (
                                <span key={idx} className="text-[10px] text-salon-golden-muted hover:text-salon-golden cursor-pointer transition-colors duration-300">
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </SectionHeader>

                {/* Staggered Product Layout */}
                <div className="flex flex-col gap-20 md:gap-24">
                    {displayProducts.map((product, idx) => (
                        <div key={product.id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Product Image */}
                            <motion.div
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                onClick={() => setSelectedProduct(product)}
                                className="w-full md:w-[60%] relative group cursor-pointer overflow-hidden bg-salon-surface p-6 md:p-12 flex justify-center items-center h-[280px] md:h-[450px] border border-transparent hover:border-salon-golden/10 transition-colors"
                            >
                                <div className="absolute inset-0 bg-salon-surface opacity-100 transition-opacity duration-1000 group-hover:opacity-0 pointer-events-none z-10 mix-blend-color"></div>
                                <img
                                    src={product.img}
                                    alt={product.title}
                                    className="w-auto h-full mix-blend-luminosity opacity-70 group-hover:mix-blend-normal group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1500ms] drop-shadow-2xl object-contain z-20"
                                />
                                <div className="absolute bottom-8 right-8 w-10 h-10 md:w-14 md:h-14 rounded-full border border-salon-golden/20 flex items-center justify-center -translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 bg-salon-base/80 backdrop-blur-sm z-30">
                                    <svg className="w-4 h-4 text-salon-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"></path></svg>
                                </div>
                            </motion.div>

                            {/* Product Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full md:w-[40%] flex flex-col items-start relative"
                            >
                                <span className="absolute -top-24 md:-top-20 -left-10 text-[6rem] md:text-[9rem] font-serif font-bold text-salon-golden/5 -z-10 leading-none pointer-events-none">
                                    0{idx + 1}
                                </span>

                                <span className="text-[9px] uppercase tracking-[0.3em] text-salon-golden-muted mb-3 relative">{product.category}</span>
                                <h3 className="text-3xl md:text-4xl font-serif text-salon-primary mb-3 relative leading-[1.1]">{product.title}</h3>
                                <p className="text-salon-golden-muted font-light text-[11px] md:text-xs tracking-wide mb-8 relative max-w-[220px] italic">
                                    By {product.brand}
                                </p>

                                <div className="flex items-center gap-8 relative">
                                    <span className="text-lg font-serif text-salon-golden">${product.price}</span>
                                    <Button 
                                        onClick={() => setSelectedProduct(product)}
                                        variant="link" 
                                        size="sm" 
                                        className="text-salon-golden-muted hover:text-salon-golden font-medium border-b border-transparent hover:border-salon-golden"
                                    >
                                        Add to Bag
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 w-full flex justify-center border-t border-salon-golden/10 pt-12"
                >
                    <Button as="a" href="#" variant="link" className="text-salon-primary hover:text-salon-golden group flex items-center gap-2 transition-colors">
                        View Full Collection
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Button>
                </motion.div>

            </div>
        </section>
    );
};

export default ProductsPreview;
